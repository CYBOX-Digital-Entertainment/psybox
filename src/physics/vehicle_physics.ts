import { system, world, Entity, Vector3, Dimension } from "@minecraft/server";

export class VehiclePhysics {
    private static readonly GRAVITY: number = -0.08;
    private static readonly AIR_RESISTANCE: number = 0.98;
    private readonly overworld: Dimension;

    constructor() {
        this.overworld = world.getDimension("overworld");
        system.runInterval(() => this.updatePhysics());
    }

    // 1. 차량 물리 시뮬레이션 메인 루프
    private updatePhysics(): void {
        const entities = this.overworld.getEntities({ 
            type: "car:basic",
            excludeTypes: ["minecraft:player"]
        });

        for (const entity of entities) {
            if (entity.isValid) {
                this.applyTerrainPhysics(entity);
                this.applyCustomProperties(entity);
            }
        }
    }

    // 2. 지형 물리 적용
    private applyTerrainPhysics(entity: Entity): void {
        const velocity = entity.getVelocity();
        const groundNormal = this.detectSlopeNormal(entity);
        
        // 경사각 계산 (0°=수직, 90°=평지)
        const slopeAngle = Math.acos(groundNormal.y) * (180 / Math.PI);
        const slopeFactor = Math.sin(slopeAngle * Math.PI / 180);

        // 3. 3축 물리 계산
        const newVelocity: Vector3 = {
            x: velocity.x * VehiclePhysics.AIR_RESISTANCE * (1 - slopeFactor),
            y: velocity.y + VehiclePhysics.GRAVITY,
            z: velocity.z * VehiclePhysics.AIR_RESISTANCE * (1 - slopeFactor)
        };

        entity.applyImpulse(newVelocity);
    }

    // 4. 경사면 노멀 벡터 검출
    private detectSlopeNormal(entity: Entity): Vector3 {
        const eyePos = entity.getHeadLocation();
        const viewDir = entity.getViewDirection();
        
        const blockHit = this.overworld.getBlockFromRay(
            eyePos, 
            viewDir, 
            { 
                maxDistance: 3,
                includeLiquidBlocks: false,
                includePassableBlocks: true 
            }
        );

        return blockHit?.block?.permutation.getState("ground_normal") as Vector3 || { x: 0, y: 1, z: 0 };
    }

    // 5. LM-1 엔티티 커스텀 프로퍼티 연동
    private applyCustomProperties(entity: Entity): void {
        const properties = entity.getDynamicProperty("vehicle_physics") as {
            mass?: number;
            tire_friction?: number;
        } ?? {};

        // 기본값 설정
        const mass = properties.mass ?? 1500;
        const friction = properties.tire_friction ?? 0.8;

        // 실제 물리 계산에 적용
        entity.applyImpulse({
            x: 0,
            y: -(mass * 0.001),
            z: 0
        });
    }
}

// 시스템 초기화
const physicsSystem = new VehiclePhysics();
