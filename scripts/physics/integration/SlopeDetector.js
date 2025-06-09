import { world } from "@minecraft/server";
/**
 * Script API 2.0.0-beta 호환 경사면 감지 시스템
 */
export class SlopeDetector {
    /**
     * 엔티티 위치에서 경사면 정보 계산
     * @param entity 대상 엔티티
     * @returns 경사면 각도, 방향, 강도 정보
     */
    static getSlopeInfo(entity) {
        try {
            const pos = entity.location;
            const overworld = world.getDimension("overworld");
            // 4방향 검출 포인트 (더 정확한 계단/반블록 감지)
            const directions = [
                { vec: { x: 0.8, y: 0, z: 0 }, name: 'x+' },
                { vec: { x: -0.8, y: 0, z: 0 }, name: 'x-' },
                { vec: { x: 0, y: 0, z: 0.8 }, name: 'z+' },
                { vec: { x: 0, y: 0, z: -0.8 }, name: 'z-' }
            ];
            // 기본값 (경사 없음)
            let maxSlope = {
                angle: 0,
                direction: { x: 0, y: 0, z: 0 },
                strength: 0
            };
            // 4방향 경사면 검사
            for (const dir of directions) {
                const checkPos = {
                    x: Math.floor(pos.x + dir.vec.x),
                    y: Math.floor(pos.y) - 1,
                    z: Math.floor(pos.z + dir.vec.z)
                };
                try {
                    const block = overworld.getBlock(checkPos);
                    if (!block)
                        continue;
                    // 블록 높이 계산
                    const blockHeight = this.calculateBlockHeight(block.typeId);
                    const heightDiff = blockHeight - (pos.y - Math.floor(pos.y));
                    // 유의미한 경사각 있는 경우만 처리
                    if (Math.abs(heightDiff) > 0.1) {
                        const distance = Math.sqrt(dir.vec.x ** 2 + dir.vec.z ** 2);
                        const angle = Math.atan(heightDiff / distance);
                        const strength = Math.abs(Math.sin(angle));
                        // 가장 가파른 경사만 사용
                        if (strength > maxSlope.strength) {
                            maxSlope = {
                                angle: angle,
                                direction: {
                                    x: heightDiff > 0 ? -dir.vec.x : dir.vec.x,
                                    y: 0,
                                    z: heightDiff > 0 ? -dir.vec.z : dir.vec.z
                                },
                                strength: strength
                            };
                        }
                    }
                }
                catch (e) {
                    // 개별 블록 검사 오류 무시
                }
            }
            return maxSlope;
        }
        catch (error) {
            console.warn("경사면 감지 오류:", error);
            return {
                angle: 0,
                direction: { x: 0, y: 0, z: 0 },
                strength: 0
            };
        }
    }
    /**
     * 블록 타입에 따른 높이 계산
     * @param blockId 블록 타입 ID
     * @returns 블록 높이 (0.0~1.0)
     */
    static calculateBlockHeight(blockId) {
        if (!blockId)
            return 1.0;
        // 계단 블록 처리 (0.5 높이)
        if (this.STEP_BLOCKS.has(blockId)) {
            return 0.5;
        }
        // 반블록 처리 (0.5 높이)  
        if (this.SLAB_BLOCKS.has(blockId)) {
            return 0.5;
        }
        // 일반 블록 (1.0 높이)
        return 1.0;
    }
    /**
     * 벡터 정규화
     * @param v 입력 벡터
     * @returns 정규화된 단위 벡터
     */
    static normalizeVector(v) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return length > 0 ? {
            x: v.x / length,
            y: v.y / length,
            z: v.z / length
        } : { x: 0, y: 0, z: 0 };
    }
}
// 계단 블록 목록
SlopeDetector.STEP_BLOCKS = new Set([
    'minecraft:oak_stairs', 'minecraft:stone_stairs', 'minecraft:brick_stairs',
    'minecraft:quartz_stairs', 'minecraft:cobblestone_stairs'
]);
// 반블록 목록
SlopeDetector.SLAB_BLOCKS = new Set([
    'minecraft:oak_slab', 'minecraft:stone_slab', 'minecraft:brick_slab',
    'minecraft:quartz_slab', 'minecraft:cobblestone_slab'
]);
