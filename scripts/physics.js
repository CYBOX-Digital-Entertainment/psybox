import { world, system, Vector3 } from '@minecraft/server';
import { CAR_REGISTRY } from './registry';

const CHECK_INTERVAL = 1;
const RAYCAST_DISTANCE = 3.0;
const SLIDE_IMPULSE_STRENGTH = 0.05;
const SLIDE_CHECK_THRESHOLD = 0.1;
const MOVEMENT_THRESHOLD = 0.05;

function getBlockRelative(entity, dx, dy, dz) {
    const { x, y, z } = entity.location;
    return entity.dimension.getBlock({ x: Math.floor(x) + dx, y: Math.floor(y) + dy, z: Math.floor(z) + dz });
}

function getSlopeAngle(block) {
    if (!block) return 0;
    const typeId = block.typeId;
    if (typeId.includes('stairs')) {
        const permutation = block.permutation;
        const facing = permutation.getProperty('minecraft:cardinal_direction')?.value;
        const half = permutation.getProperty('minecraft:block_half')?.value;
        if (half === 'bottom') {
            if (facing === 'north' || facing === 'south') {
                return 22.5;
            } else {
                return 22.5;
            }
        }
    } else if (typeId.includes('slab') && block.permutation.getProperty('minecraft:vertical_half')?.value === 'bottom') {
        return 11.25;
    }
    return 0;
}

system.runInterval(() => {
    for (const carConfig of CAR_REGISTRY) {
        const cars = world.getDimension('overworld').getEntities({ type: carConfig.entityId });
        for (const car of cars) {
            const currentVelocity = car.getVelocity();
            const horizontalSpeed = Math.sqrt(currentVelocity.x * currentVelocity.x + currentVelocity.z * currentVelocity.z);
            const blockBelow = car.dimension.getBlock(car.location);
            const blockInFront = getBlockRelative(car, Math.sin(car.rotation.y * Math.PI / 180), 0, Math.cos(car.rotation.y * Math.PI / 180));
            const blockBehind = getBlockRelative(car, -Math.sin(car.rotation.y * Math.PI / 180), 0, -Math.cos(car.rotation.y * Math.PI / 180));

            let currentTiltState = 0;
            const rayHitFront = car.dimension.blockRaycast(car.location, { x: Math.sin(car.rotation.y * Math.PI / 180), y: -0.5, z: Math.cos(car.rotation.y * Math.PI / 180) }, { maxDistance: RAYCAST_DISTANCE });
            const rayHitBack = car.dimension.blockRaycast(car.location, { x: -Math.sin(car.rotation.y * Math.PI / 180), y: -0.5, z: -Math.cos(car.rotation.y * Math.PI / 180) }, { maxDistance: RAYCAST_DISTANCE });

            if (rayHitFront && rayHitFront.block && rayHitFront.block.location.y < car.location.y - 0.5) {
                currentTiltState = 2; // 앞 내리막
            } else if (rayHitBack && rayHitBack.block && rayHitBack.block.location.y < car.location.y - 0.5) {
                currentTiltState = 4; // 뒤 내리막
            } else if (rayHitFront && rayHitFront.block && rayHitFront.block.location.y > car.location.y + 0.5) {
                currentTiltState = 1; // 앞 오르막
            } else if (rayHitBack && rayHitBack.block && rayHitBack.block.location.y > car.location.y + 0.5) {
                currentTiltState = 3; // 뒤 오르막
            }

            car.setProperty('cybox:car_tilt_state', currentTiltState);
            car.setProperty('cybox:is_moving', horizontalSpeed > MOVEMENT_THRESHOLD);

            if (horizontalSpeed < SLIDE_CHECK_THRESHOLD && currentTiltState !== 0) {
                let slideDirection = { x: 0, y: 0, z: 0 };
                if (currentTiltState === 1 || currentTiltState === 3) {
                    slideDirection = { x: -currentVelocity.x, y: 0, z: -currentVelocity.z };
                } else if (currentTiltState === 2 || currentTiltState === 4) {
                    slideDirection = { x: currentVelocity.x, y: 0, z: currentVelocity.z };
                }
                const slideImpulse = new Vector3(slideDirection.x * SLIDE_IMPULSE_STRENGTH, 0, slideDirection.z * SLIDE_IMPULSE_STRENGTH);
                car.applyImpulse(slideImpulse);
            }
        }
    }
}, CHECK_INTERVAL);