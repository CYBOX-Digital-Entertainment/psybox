import { world, Entity, Vector3 } from "@minecraft/server";

/**
 * 3D 공간에서 경사면 각도와 방향을 계산하는 유틸리티 클래스
 * - Minecraft Bedrock 1.21.82 안정화 API 전용
 */
export class SlopeDetector {
    static getSlopeInfo(entity: Entity): { angle: number, direction: Vector3 } {
        const pos = entity.location;
        const overworld = world.getDimension("overworld");
        
        // X축 방향 검출
        const forwardX = { x: pos.x + 0.5, y: pos.y, z: pos.z };
        const backwardX = { x: pos.x - 0.5, y: pos.y, z: pos.z };
        
        // Z축 방향 검출
        const forwardZ = { x: pos.x, y: pos.y, z: pos.z + 0.5 };
        const backwardZ = { x: pos.x, y: pos.y, z: pos.z - 0.5 };

        try {
            // 블록 높이 비교 (X축)
            const blockX1 = overworld.getBlock(forwardX);
            const blockX2 = overworld.getBlock(backwardX);
            const slopeX = (blockX1?.y ?? pos.y) - (blockX2?.y ?? pos.y);

            // 블록 높이 비교 (Z축)
            const blockZ1 = overworld.getBlock(forwardZ);
            const blockZ2 = overworld.getBlock(backwardZ);
            const slopeZ = (blockZ1?.y ?? pos.y) - (blockZ2?.y ?? pos.y);

            // 가장 가파른 경사 선택
            if (Math.abs(slopeX) > Math.abs(slopeZ)) {
                return {
                    angle: Math.atan(slopeX / 1.0), // 1m 거리 차이
                    direction: this.normalizeVector({ x: slopeX, y: 0, z: 0 })
                };
            } else {
                return {
                    angle: Math.atan(slopeZ / 1.0),
                    direction: this.normalizeVector({ x: 0, y: 0, z: slopeZ })
                };
            }
        } catch (e) {
            console.error("SlopeDetector Error:", e);
            return { angle: 0, direction: { x: 0, y: 0, z: 0 } };
        }
    }

    private static normalizeVector(v: Vector3): Vector3 {
        const length = Math.sqrt(v.x**2 + v.y**2 + v.z**2);
        return { 
            x: v.x / length || 0, 
            y: v.y / length || 0, 
            z: v.z / length || 0 
        };
    }
}
