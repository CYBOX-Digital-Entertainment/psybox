import { world, system } from '@minecraft/server';
import { getRegisteredCars } from './registry';
const SLAB_SPEED = 0.05;
const STAIRS_SPEED = 0.07;
const directions = ['east', 'north', 'south', 'west'];
const isSlab = (t) => t.includes('slab') && !t.includes('double');
const isAir = (t) => t.includes(':air');
const isTop = (b) => b?.permutation.getAllStates()['top_slot_bit'];
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
    if (deviation < 20)
        return;
    if (isBackward)
        entity.triggerEvent('phy_back');
    else
        entity.triggerEvent('phy_front');
}
system.runInterval(() => {
    for (const [entity, config] of getRegisteredCars(world.getDimension('overworld'))) {
        const loc = entity.location;
        let block;
        while (loc.y > 0) {
            const b = entity.dimension.getBlock(loc);
            loc.y--;
            if (!b || isAir(b.typeId))
                continue;
            block = b;
            break;
        }
        if (!block)
            continue;
        const blockType = block.typeId;
        const slabApplied = directions.some(dir => {
            const adjacent = block[dir]?.();
            const adjType = adjacent?.typeId ?? '';
            const adjTypeAbove = adjacent?.above()?.typeId ?? '';
            if ((isSlab(adjType) && isAir(adjTypeAbove) && !isSlab(blockType) && !isAir(blockType)) ||
                (isSlab(blockType) && isAir(adjType) && isAir(adjTypeAbove)) ||
                (isSlab(blockType) && isSlab(adjType) && isTop(block) && !isTop(adjacent))) {
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
        if (!isAir(directionMap[dirId]?.block?.typeId))
            continue;
        applyPhysics(entity, config, directionMap[dirId].dir, STAIRS_SPEED);
    }
}, 2);
