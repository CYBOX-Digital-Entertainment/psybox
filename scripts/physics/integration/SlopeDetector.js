import { world } from "@minecraft/server";
export class SlopeDetector {
    static getSlopeInfo(entity) {
        const pos = entity.location;
        const overworld = world.getDimension("overworld");
        // 4방향 경사면 검출
        const directions = [
            { vec: { x: 0.8, y: 0, z: 0 }, name: 'x+' },
            { vec: { x: -0.8, y: 0, z: 0 }, name: 'x-' },
            { vec: { x: 0, y: 0, z: 0.8 }, name: 'z+' },
            { vec: { x: 0, y: 0, z: -0.8 }, name: 'z-' }
        ];
        let maxSlope = { angle: 0, direction: { x: 0, y: 0, z: 0 }, strength: 0 };
        for (const dir of directions) {
            try {
                const checkPos = {
                    x: Math.floor(pos.x + dir.vec.x),
                    y: Math.floor(pos.y),
                    z: Math.floor(pos.z + dir.vec.z)
                };
                const block = overworld.getBlock(checkPos);
                const heightDiff = this.calculateBlockHeight(block, pos) - pos.y;
                if (Math.abs(heightDiff) > 0.1) {
                    const distance = Math.sqrt(dir.vec.x ** 2 + dir.vec.z ** 2);
                    const angle = Math.atan(heightDiff / distance);
                    const strength = Math.abs(heightDiff) / distance;
                    if (strength > maxSlope.strength) {
                        maxSlope = {
                            angle: angle,
                            direction: this.normalizeVector({
                                x: heightDiff > 0 ? -dir.vec.x : dir.vec.x,
                                y: 0,
                                z: heightDiff > 0 ? -dir.vec.z : dir.vec.z
                            }),
                            strength: strength
                        };
                    }
                }
            }
            catch (error) {
                // 블록 접근 실패 시 무시
            }
        }
        return maxSlope;
    }
    static calculateBlockHeight(block, entityPos) {
        if (!block?.typeId)
            return entityPos.y;
        const baseY = block.location.y;
        // 반블록 처리
        if (this.SLAB_BLOCKS.has(block.typeId)) {
            return baseY + 0.5;
        }
        // 계단 처리
        if (this.STEP_BLOCKS.has(block.typeId)) {
            return baseY + 0.5;
        }
        // 일반 블록
        return baseY + 1.0;
    }
    static normalizeVector(v) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return length > 0 ? { x: v.x / length, y: v.y / length, z: v.z / length } : { x: 0, y: 0, z: 0 };
    }
}
SlopeDetector.STEP_BLOCKS = new Set([
    'minecraft:oak_stairs', 'minecraft:stone_stairs', 'minecraft:brick_stairs',
    'minecraft:quartz_stairs', 'minecraft:cobblestone_stairs'
]);
SlopeDetector.SLAB_BLOCKS = new Set([
    'minecraft:oak_slab', 'minecraft:stone_slab', 'minecraft:brick_slab',
    'minecraft:quartz_slab', 'minecraft:cobblestone_slab'
]);
