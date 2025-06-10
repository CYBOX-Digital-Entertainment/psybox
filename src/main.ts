import { world, system, Vector3, Entity, Player, Dimension } from "@minecraft/server";

export class PsyboxPhysicsEngine {
    private static instance: PsyboxPhysicsEngine;
    private debugMode: boolean = false;
    private physicsEntities: Set<Entity> = new Set();
    private readonly GRAVITY_FORCE = -0.08;
    private readonly FRICTION_GROUND = 0.7;
    private readonly FRICTION_AIR = 0.98;
    private readonly SLOPE_THRESHOLD = 0.3; // 경사각도 임계값 (약 17도)

    private constructor() {
        this.initializePhysicsEngine();
    }

    public static getInstance(): PsyboxPhysicsEngine {
        if (!PsyboxPhysicsEngine.instance) {
            PsyboxPhysicsEngine.instance = new PsyboxPhysicsEngine();
        }
        return PsyboxPhysicsEngine.instance;
    }

    private initializePhysicsEngine(): void {
        console.warn("Psybox Physics Engine v2.1.2-beta 초기화 중...");

        // Script Event 처리 - Script API 2.0.0-beta에서 system.afterEvents로 이동
        system.afterEvents.scriptEventReceive.subscribe((event) => {
            if (event.id.startsWith("psybox:")) {
                this.handleScriptEvent(event.id, event.message || "", event.sourceEntity);
            }
        });

        // 메인 물리 시뮬레이션 루프
        this.startPhysicsLoop();

        console.warn("Psybox Physics Engine 초기화 완료!");
    }

    private handleScriptEvent(eventId: string, message: string, entity?: Entity): void {
        const command = eventId.replace("psybox:", "");

        switch (command) {
            case "debug_on":
                this.debugMode = true;
                if (entity instanceof Player) {
                    entity.sendMessage("§a[Psybox] 디버그 모드 활성화");
                }
                break;

            case "debug_off":
                this.debugMode = false;
                if (entity instanceof Player) {
                    entity.sendMessage("§c[Psybox] 디버그 모드 비활성화");
                }
                break;

            case "physics_info":
                if (entity instanceof Player) {
                    entity.sendMessage(`§e[Psybox] Physics Engine v2.1.2-beta`);
                    entity.sendMessage(`§7- API: Script 2.0.0-beta.1.21.82-stable`);
                    entity.sendMessage(`§7- 활성 엔티티: ${this.physicsEntities.size}개`);
                }
                break;

            case "slope_test":
                this.performSlopeTest(entity);
                break;
        }
    }

    private startPhysicsLoop(): void {
        system.runInterval(() => {
            this.updatePhysics();
        }, 1); // 매 틱마다 실행
    }

    private updatePhysics(): void {
        // 모든 차원에서 물리 대상 엔티티 검색
        const dimensions = [
            world.getDimension("overworld"),
            world.getDimension("nether"), 
            world.getDimension("the_end")
        ];

        for (const dimension of dimensions) {
            const entities = dimension.getEntities({
                type: "cybox:spirra" // 사용자가 지정한 테스트 엔티티
            });

            for (const entity of entities) {
                if (!entity.isValid) continue;
                this.applyPhysics(entity, dimension);
            }
        }
    }

    private applyPhysics(entity: Entity, dimension: Dimension): void {
        try {
            const entityLocation = entity.location;
            const currentVelocity = entity.getVelocity();

            // MACHINE_BUILDER 스타일의 raycast 경사면 검출
            const slopeData = this.detectSlope(entity, dimension);

            // 물리 프로퍼티 업데이트
            this.updatePhysicsProperties(entity, slopeData, currentVelocity);

            // 중력 및 경사면 물리 적용
            if (slopeData.isOnSlope) {
                this.applySlopePhysics(entity, slopeData);
            } else {
                this.applyGravity(entity);
            }

            // 마찰 적용
            this.applyFriction(entity, slopeData.isGrounded);

            // 디버그 HUD 표시
            if (this.debugMode) {
                this.showDebugHUD(entity, slopeData, currentVelocity);
            }

        } catch (error) {
            console.warn(`[Psybox] 물리 적용 오류: ${error}`);
        }
    }

    private detectSlope(entity: Entity, dimension: Dimension): SlopeData {
        const entityLocation = entity.location;
        const entityRotation = entity.getRotation();

        // MACHINE_BUILDER 방식: 전방과 후방 두 점에서 raycast
        const frontOffset = 1.0;
        const frontLocation: Vector3 = {
            x: entityLocation.x + Math.sin(entityRotation.y * Math.PI / 180) * frontOffset,
            y: entityLocation.y + 1,
            z: entityLocation.z + Math.cos(entityRotation.y * Math.PI / 180) * frontOffset
        };

        const backLocation: Vector3 = {
            x: entityLocation.x - Math.sin(entityRotation.y * Math.PI / 180) * frontOffset,
            y: entityLocation.y + 1,
            z: entityLocation.z - Math.cos(entityRotation.y * Math.PI / 180) * frontOffset
        };

        // 전방 raycast (아래쪽으로)
        const frontRaycast = dimension.getBlockFromRay(frontLocation, { x: 0, y: -3, z: 0 });
        const backRaycast = dimension.getBlockFromRay(backLocation, { x: 0, y: -3, z: 0 });

        // 지면 검출 (엔티티 바로 아래)
        const groundRaycast = dimension.getBlockFromRay(
            { x: entityLocation.x, y: entityLocation.y + 0.5, z: entityLocation.z },
            { x: 0, y: -2, z: 0 }
        );

        const isGrounded = groundRaycast !== undefined && 
                          (entityLocation.y - groundRaycast.block.location.y) <= 1.2;

        let slopeAngle = 0;
        let isOnSlope = false;
        let slopeDirection: Vector3 = { x: 0, y: 0, z: 0 };

        if (frontRaycast && backRaycast && isGrounded) {
            const frontY = frontRaycast.block.location.y;
            const backY = backRaycast.block.location.y;
            const heightDiff = frontY - backY;

            // 경사각도 계산
            slopeAngle = Math.atan2(Math.abs(heightDiff), frontOffset * 2) * (180 / Math.PI);
            isOnSlope = slopeAngle > 5 && slopeAngle < 60; // 5도~60도 범위에서 경사면으로 인식

            if (isOnSlope) {
                // 경사 방향 계산 (아래쪽으로)
                const slopeStrength = Math.sin(slopeAngle * Math.PI / 180) * 0.15;

                if (heightDiff > 0) { // 전방이 높으면 뒤로 미끄러짐
                    slopeDirection = {
                        x: -Math.sin(entityRotation.y * Math.PI / 180) * slopeStrength,
                        y: -0.02,
                        z: -Math.cos(entityRotation.y * Math.PI / 180) * slopeStrength
                    };
                } else { // 후방이 높으면 앞으로 미끄러짐
                    slopeDirection = {
                        x: Math.sin(entityRotation.y * Math.PI / 180) * slopeStrength,
                        y: -0.02,
                        z: Math.cos(entityRotation.y * Math.PI / 180) * slopeStrength
                    };
                }
            }
        }

        return {
            isGrounded,
            isOnSlope,
            slopeAngle,
            slopeDirection,
            slopeStrength: Math.sin(slopeAngle * Math.PI / 180)
        };
    }

    private applySlopePhysics(entity: Entity, slopeData: SlopeData): void {
        try {
            // applyImpulse로 경사면 미끄러짐 효과 적용
            const impulse: Vector3 = {
                x: slopeData.slopeDirection.x * 0.8,
                y: slopeData.slopeDirection.y * 0.5,
                z: slopeData.slopeDirection.z * 0.8
            };

            entity.applyImpulse(impulse);

        } catch (error) {
            console.warn(`[Psybox] 경사면 물리 적용 실패: ${error}`);
        }
    }

    private applyGravity(entity: Entity): void {
        try {
            const gravityImpulse: Vector3 = {
                x: 0,
                y: this.GRAVITY_FORCE,
                z: 0
            };

            entity.applyImpulse(gravityImpulse);

        } catch (error) {
            console.warn(`[Psybox] 중력 적용 실패: ${error}`);
        }
    }

    private applyFriction(entity: Entity, isGrounded: boolean): void {
        try {
            const currentVelocity = entity.getVelocity();
            const frictionForce = isGrounded ? this.FRICTION_GROUND : this.FRICTION_AIR;

            // 수평 속도에만 마찰 적용
            const frictionImpulse: Vector3 = {
                x: -currentVelocity.x * (1 - frictionForce) * 0.1,
                y: 0,
                z: -currentVelocity.z * (1 - frictionForce) * 0.1
            };

            entity.applyImpulse(frictionImpulse);

        } catch (error) {
            console.warn(`[Psybox] 마찰 적용 실패: ${error}`);
        }
    }

    private updatePhysicsProperties(entity: Entity, slopeData: SlopeData, velocity: Vector3): void {
        try {
            // 동적 프로퍼티로 물리 상태 저장
            entity.setDynamicProperty("psybox:velx", Math.round(velocity.x * 100) / 100);
            entity.setDynamicProperty("psybox:vely", Math.round(velocity.y * 100) / 100);
            entity.setDynamicProperty("psybox:velz", Math.round(velocity.z * 100) / 100);
            entity.setDynamicProperty("psybox:isgrounded", slopeData.isGrounded);
            entity.setDynamicProperty("psybox:issliding", slopeData.isOnSlope);
            entity.setDynamicProperty("psybox:slopeangle", Math.round(slopeData.slopeAngle * 10) / 10);
            entity.setDynamicProperty("psybox:slopestrength", Math.round(slopeData.slopeStrength * 100) / 100);
            entity.setDynamicProperty("psybox:mass", 1.0);
            entity.setDynamicProperty("psybox:friction", slopeData.isGrounded ? this.FRICTION_GROUND : this.FRICTION_AIR);

        } catch (error) {
            console.warn(`[Psybox] 프로퍼티 업데이트 실패: ${error}`);
        }
    }

    private showDebugHUD(entity: Entity, slopeData: SlopeData, velocity: Vector3): void {
        try {
            const location = entity.location;
            const debugText = [
                `§e=== Psybox Physics Debug ===`,
                `§7위치: ${Math.round(location.x * 10) / 10}, ${Math.round(location.y * 10) / 10}, ${Math.round(location.z * 10) / 10}`,
                `§7속도: X=${Math.round(velocity.x * 100) / 100} Y=${Math.round(velocity.y * 100) / 100} Z=${Math.round(velocity.z * 100) / 100}`,
                `§7지면 접촉: ${slopeData.isGrounded ? "§a예" : "§c아니오"}`,
                `§7경사면 상태: ${slopeData.isOnSlope ? "§6미끄러짐" : "§a평지"}`,
                `§7경사각도: ${Math.round(slopeData.slopeAngle * 10) / 10}°`,
                `§7경사력: ${Math.round(slopeData.slopeStrength * 100) / 100}`
            ];

            entity.runCommand(`title @s actionbar ${debugText.join("\n")}`);

        } catch (error) {
            console.warn(`[Psybox] 디버그 HUD 표시 실패: ${error}`);
        }
    }

    private performSlopeTest(entity?: Entity): void {
        if (!entity) return;

        try {
            entity.sendMessage("§a[Psybox] 경사면 테스트 시작...");
            entity.sendMessage("§7계단이나 반블럭 경사면에 서보세요!");

            // 테스트 엔티티 소환
            const dimension = entity.dimension;
            const location = entity.location;

            const testLocation: Vector3 = {
                x: location.x + 2,
                y: location.y + 2,
                z: location.z
            };

            const testEntity = dimension.spawnEntity("cybox:spirra", testLocation);

            // 3초 후 자동 제거
            system.runTimeout(() => {
                if (testEntity && testEntity.isValid) {
                    testEntity.kill();
                    entity.sendMessage("§e[Psybox] 테스트 완료!");
                }
            }, 60); // 3초 = 60틱

        } catch (error) {
            console.warn(`[Psybox] 경사면 테스트 실패: ${error}`);
            if (entity instanceof Player) {
                entity.sendMessage("§c[Psybox] 테스트 실패: cybox:spirra 엔티티를 찾을 수 없습니다.");
            }
        }
    }
}

interface SlopeData {
    isGrounded: boolean;
    isOnSlope: boolean;
    slopeAngle: number;
    slopeDirection: Vector3;
    slopeStrength: number;
}

// 물리엔진 인스턴스 생성 및 시작
const physicsEngine = PsyboxPhysicsEngine.getInstance();