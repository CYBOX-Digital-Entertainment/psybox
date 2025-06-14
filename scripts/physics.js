import { world, system } from '@minecraft/server';
import { getRegisteredCars } from './registry';
const SLAB_SPEED = 0.1;
const STAIRS_SPEED = 0.2;
const directions = ['east', 'north', 'south', 'west'];
function applyPhysics(entity, config, dir, speedScale) {
    const yawDegrees = entity.getRotation().y;
    const yawRadians = (yawDegrees * Math.PI) / 180;
    let directionX = Math.sin(yawRadians);
    let directionZ = Math.cos(yawRadians);
    let isBackward;
    let deviation;
    const normYaw = ((yawDegrees % 360) + 360) % 360;
    switch (dir) {
        case 'south':
            isBackward = yawDegrees >= 90 || yawDegrees <= -90;
            deviation = Math.min(Math.abs(yawDegrees - 90), Math.abs(yawDegrees + 90));
            break;
        case 'north':
            isBackward = yawDegrees >= -90 && yawDegrees <= 90;
            deviation = Math.min(Math.abs(yawDegrees - 90), Math.abs(yawDegrees + 90));
            break;
        case 'west':
            isBackward = yawDegrees >= -180 && yawDegrees <= 0;
            deviation = Math.min(Math.abs(normYaw - 180), Math.abs(normYaw));
            break;
        case 'east':
            isBackward = yawDegrees > 0;
            deviation = Math.min(Math.abs(normYaw - 180), Math.abs(normYaw));
            break;
        default: return;
    }
    if (isBackward) {
        directionX = -directionX;
        directionZ = -directionZ;
    }
    const fadeFactor = deviation > 20 ? 2 : Math.cos((deviation / 20) * (Math.PI / 2));
    const impulse = {
        x: -directionX * fadeFactor * speedScale,
        y: config.weight * -1,
        z: directionZ * fadeFactor * speedScale,
    };
    entity.applyImpulse(impulse);
}
system.runInterval(() => {
    for (const [entity, config] of getRegisteredCars(world.getDimension('overworld'))) {
        const loc = entity.location;
        loc.y--;
        const block = entity.dimension.getBlock(loc);
        if (!block)
            continue;
        const blockType = block.typeId;
        const slabApplied = directions.some(dir => {
            const adjacent = block[dir]?.();
            const adjType = adjacent?.typeId ?? '';
            if ((adjType.includes('slab') && !(blockType.includes('slab') || blockType.includes(':air'))) ||
                (blockType.includes('slab') && adjType.includes(':air'))) {
                applyPhysics(entity, config, dir, SLAB_SPEED);
                return true;
            }
            return false;
        });
        if (slabApplied || !blockType.includes('stairs'))
            continue;
        const dirId = block.permutation.getAllStates()['weirdo_direction'];
        const directionMap = {
            0: { dir: 'west', block: block.west(1) },
            1: { dir: 'east', block: block.east(1) },
            2: { dir: 'north', block: block.north(1) },
            3: { dir: 'south', block: block.south(1) },
        };
        if (typeof dirId !== 'number')
            continue;
        if (!directionMap[dirId]?.block?.typeId.includes(':air'))
            continue;
        applyPhysics(entity, config, directionMap[dirId].dir, STAIRS_SPEED);
    }
}, 2);
