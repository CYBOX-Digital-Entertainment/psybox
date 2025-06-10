import { Vector3, Entity, Dimension } from "@minecraft/server";

// 경사면 관련 인터페이스
interface GroundInfo {
    isOnGround: boolean;
    surfaceAngle: number;
    surfaceNormal: Vector3;
    surfaceType: string;
}

interface SlopeInfo {
    angle: number;
    direction: Vector3;
    strength: number;
    isSlippery: boolean;
}

// Strategy 패턴으로 구현된 경사면 물리학 클래스
export class SlopePhysics {
    // 물리 상수들 (사용되지 않는 것들 제거)
    private readonly GRAVITY_STRENGTH = 0.08;
    private readonly MAX_SLOPE_ANGLE = 60.0;
    private readonly FRICTION_COEFFICIENTS = {
        stone: 0.7,
        dirt: 0.6,
        grass: 0.65,
        wood: 0.5,
        ice: 0.1,
        default: 0.6
    };

    constructor() {
        // 초기화 로직
    }

    // 엔티티의 지면 정보 분석
    public analyzeGround(entity: Entity): GroundInfo {
        try {
            const location = entity.location;
            const dimension = entity.dimension;

            // 발 아래 블럭 검사
            const belowLocation = {
                x: Math.floor(location.x),
                y: Math.floor(location.y - 0.1),
                z: Math.floor(location.z)
            };

            const block = dimension.getBlock(belowLocation);
            if (!block || block.isAir) {
                return {
                    isOnGround: false,
                    surfaceAngle: 0,
                    surfaceNormal: { x: 0, y: 1, z: 0 },
                    surfaceType: "air"
                };
            }

            // 8방향 경사면 검출
            const slopeAngle = this.calculateSlopeAngle(entity, dimension);
            const surfaceNormal = this.calculateSurfaceNormal(entity, dimension);

            return {
                isOnGround: true,
                surfaceAngle: slopeAngle,
                surfaceNormal: surfaceNormal,
                surfaceType: block.typeId
            };

        } catch (error) {
            console.error("§c[SlopePhysics] 지면 분석 실패:", error);
            return {
                isOnGround: false,
                surfaceAngle: 0,
                surfaceNormal: { x: 0, y: 1, z: 0 },
                surfaceType: "unknown"
            };
        }
    }

    // 경사면 물리 적용
    public applyPhysics(entity: Entity, groundInfo: GroundInfo, deltaTime: number): void {
        try {
            if (!entity.isValid || !groundInfo.isOnGround) return;

            const slopeInfo = this.calculateSlopeInfo(groundInfo);

            if (slopeInfo.angle > 5.0 && slopeInfo.angle < this.MAX_SLOPE_ANGLE) {
                this.applySlopeForces(entity, slopeInfo, groundInfo, deltaTime);
            }

        } catch (error) {
            console.error("§c[SlopePhysics] 물리 적용 실패:", error);
        }
    }

    private calculateSlopeAngle(entity: Entity, dimension: Dimension): number {
        try {
            const location = entity.location;
            const checkRadius = 1.0;
            let maxHeightDiff = 0;

            // 8방향 높이 검사
            const directions = [
                { x: 1, z: 0 }, { x: -1, z: 0 },
                { x: 0, z: 1 }, { x: 0, z: -1 },
                { x: 1, z: 1 }, { x: -1, z: -1 },
                { x: 1, z: -1 }, { x: -1, z: 1 }
            ];

            const baseHeight = Math.floor(location.y);

            directions.forEach(dir => {
                const checkLocation = {
                    x: Math.floor(location.x + dir.x * checkRadius),
                    y: baseHeight,
                    z: Math.floor(location.z + dir.z * checkRadius)
                };

                // 해당 위치에서 가장 높은 블럭 찾기
                for (let y = baseHeight + 3; y >= baseHeight - 3; y--) {
                    const testLocation = { ...checkLocation, y };
                    const block = dimension.getBlock(testLocation);

                    if (block && !block.isAir) {
                        const heightDiff = Math.abs(y - baseHeight);
                        maxHeightDiff = Math.max(maxHeightDiff, heightDiff);
                        break;
                    }
                }
            });

            // 각도 계산
            return Math.atan(maxHeightDiff / checkRadius) * 180 / Math.PI;

        } catch (error) {
            console.error("§c[SlopePhysics] 경사각 계산 실패:", error);
            return 0;
        }
    }

    private calculateSurfaceNormal(entity: Entity, dimension: Dimension): Vector3 {
        try {
            const location = entity.location;

            // 전방과 우측 벡터로 법선 벡터 계산
            const forward = this.getHeightAt(dimension, location.x + 1, location.z) - 
                           this.getHeightAt(dimension, location.x - 1, location.z);
            const right = this.getHeightAt(dimension, location.x, location.z + 1) - 
                         this.getHeightAt(dimension, location.x, location.z - 1);

            // 외적으로 법선 벡터 계산
            const normal = {
                x: -forward,
                y: 2.0,
                z: -right
            };

            // 정규화
            const length = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
            if (length > 0) {
                return {
                    x: normal.x / length,
                    y: normal.y / length,
                    z: normal.z / length
                };
            }

            return { x: 0, y: 1, z: 0 };

        } catch (error) {
            console.error("§c[SlopePhysics] 표면 법선 계산 실패:", error);
            return { x: 0, y: 1, z: 0 };
        }
    }

    private getHeightAt(dimension: Dimension, x: number, z: number): number {
        try {
            const baseY = 100; // 적당한 기준 높이

            // 위에서 아래로 블럭 찾기
            for (let y = baseY + 50; y >= baseY - 50; y--) {
                const block = dimension.getBlock({ x: Math.floor(x), y, z: Math.floor(z) });
                if (block && !block.isAir) {
                    return y;
                }
            }

            return baseY;
        } catch {
            return 100;
        }
    }

    private calculateSlopeInfo(groundInfo: GroundInfo): SlopeInfo {
        const angle = groundInfo.surfaceAngle;
        const direction = {
            x: -groundInfo.surfaceNormal.x,
            y: 0,
            z: -groundInfo.surfaceNormal.z
        };

        // 방향 벡터 정규화
        const length = Math.sqrt(direction.x ** 2 + direction.z ** 2);
        if (length > 0) {
            direction.x /= length;
            direction.z /= length;
        }

        return {
            angle: angle,
            direction: direction,
            strength: Math.min(angle / 45.0, 1.0),
            isSlippery: angle > 25.0
        };
    }

    private applySlopeForces(entity: Entity, slopeInfo: SlopeInfo, groundInfo: GroundInfo, deltaTime: number): void {
        try {
            const currentVelocity = entity.getVelocity();

            // 경사면 아래로 향하는 힘 계산
            const slopeForce = this.GRAVITY_STRENGTH * slopeInfo.strength * deltaTime;

            // 마찰 계수 계산
            const surfaceType = this.getSurfaceType(groundInfo.surfaceType);
            const friction = this.FRICTION_COEFFICIENTS[surfaceType] || this.FRICTION_COEFFICIENTS.default;

            // 새로운 속도 계산
            const finalVelX = currentVelocity.x + (slopeInfo.direction.x * slopeForce);
            const finalVelZ = currentVelocity.z + (slopeInfo.direction.z * slopeForce);

            // applyKnockback 메서드 시그니처 수정 (VectorXZ와 verticalStrength 사용)
            entity.applyKnockback(
                { x: finalVelX * 0.1, z: finalVelZ * 0.1 }, // VectorXZ
                currentVelocity.y * 0.1 // verticalStrength
            );

            // 마찰 적용
            if (!slopeInfo.isSlippery) {
                entity.applyKnockback(
                    { 
                        x: -currentVelocity.x * friction * 0.1, 
                        z: -currentVelocity.z * friction * 0.1 
                    },
                    0
                );
            }

        } catch (error) {
            console.error("§c[SlopePhysics] 경사면 힘 적용 실패:", error);
        }
    }

    private getSurfaceType(blockType: string): string {
        if (blockType.includes("stone")) return "stone";
        if (blockType.includes("dirt")) return "dirt";
        if (blockType.includes("grass")) return "grass";
        if (blockType.includes("wood") || blockType.includes("log")) return "wood";
        if (blockType.includes("ice")) return "ice";
        return "default";
    }

    // 경사면 정보를 JSON으로 반환 (디버깅용)
    public getSlopeData(entity: Entity): string {
        try {
            const groundInfo = this.analyzeGround(entity);
            const slopeInfo = this.calculateSlopeInfo(groundInfo);

            return JSON.stringify({
                isOnGround: groundInfo.isOnGround,
                surfaceAngle: groundInfo.surfaceAngle.toFixed(2),
                slopeStrength: slopeInfo.strength.toFixed(2),
                isSlippery: slopeInfo.isSlippery,
                surfaceType: groundInfo.surfaceType
            }, null, 2);

        } catch (error) {
            return JSON.stringify({ error: error.toString() });
        }
    }
}
