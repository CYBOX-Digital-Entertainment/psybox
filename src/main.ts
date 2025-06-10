import { 
    world, 
    system, 
    Entity, 
    Player, 
    Vector3, 
    Dimension,
    EntityType
} from "@minecraft/server";

// 물리 상수 정의
const PHYSICS_CONSTANTS = {
    GRAVITY: -0.08,
    AIR_RESISTANCE: 0.98,
    GROUND_FRICTION: 0.9,
    MIN_VELOCITY_THRESHOLD: 0.001,
    MAX_VELOCITY: 10.0,
    SLOPE_ANGLE_THRESHOLD: 5.0
} as const;

// 물리 데이터 인터페이스
interface PhysicsData {
    velx: number;
    vely: number;
    velz: number;
    isgrounded: boolean;
    issliding: boolean;
    slopeangle: number;
    slopestrength: number;
    mass: number;
    friction: number;
}

// Singleton 패턴으로 구현된 물리엔진 메인 클래스
export class PsyboxPhysicsEngine {
    private static instance: PsyboxPhysicsEngine;
    private debugMode: boolean = false;
    private physicsEntities: Map<string, PhysicsData> = new Map();
    private lastUpdateTime: number = Date.now();

    private constructor() {
        this.initializeEventHandlers();
    }

    public static getInstance(): PsyboxPhysicsEngine {
        if (!PsyboxPhysicsEngine.instance) {
            PsyboxPhysicsEngine.instance = new PsyboxPhysicsEngine();
        }
        return PsyboxPhysicsEngine.instance;
    }

    private initializeEventHandlers(): void {
        try {
            // Script API 2.0.0-beta에서 scriptEventReceive는 system.afterEvents로 이동
            system.afterEvents.scriptEventReceive.subscribe((event) => {
                this.handleScriptEvent(event.id, event.message, event.sourceEntity);
            });

            // 월드 로드 이벤트 (worldInitialize -> worldLoad로 변경)
            world.afterEvents.worldLoad.subscribe(() => {
                this.initializePhysicsSystem();
            });

            // 엔티티 스폰 이벤트
            world.afterEvents.entitySpawn.subscribe((event) => {
                this.initializeEntityPhysics(event.entity);
            });

            // 게임 틱 이벤트
            system.runInterval(() => {
                this.updatePhysics();
            }, 1);

        } catch (error) {
            console.error("§c[Psybox] 이벤트 핸들러 초기화 실패:", error);
        }
    }

    private initializePhysicsSystem(): void {
        try {
            const dimensions = [
                world.getDimension("overworld"),
                world.getDimension("nether"), 
                world.getDimension("the_end")
            ];

            dimensions.forEach(dimension => {
                // 차원별 중력 설정
                const gravityMultiplier = this.getDimensionGravityMultiplier(dimension.id);
                console.log(`§a[Psybox] ${dimension.id} 차원 물리엔진 초기화 (중력: ${gravityMultiplier}x)`);
            });

        } catch (error) {
            console.error("§c[Psybox] 물리 시스템 초기화 실패:", error);
        }
    }

    private getDimensionGravityMultiplier(dimensionId: string): number {
        switch (dimensionId) {
            case "nether": return 1.2;
            case "the_end": return 0.6;
            default: return 1.0;
        }
    }

    private handleScriptEvent(id: string, message: string, sourceEntity?: Entity): void {
        if (!id.startsWith("psybox:")) return;

        const command = id.substring(7); // "psybox:" 제거

        try {
            switch (command) {
                case "debug_on":
                    this.debugMode = true;
                    this.sendMessageToPlayer(sourceEntity, "§a[Psybox] 디버그 모드 활성화");
                    break;

                case "debug_off":
                    this.debugMode = false;
                    this.sendMessageToPlayer(sourceEntity, "§7[Psybox] 디버그 모드 비활성화");
                    break;

                case "slope_test":
                    this.runSlopeTest(sourceEntity);
                    break;

                case "physics_info":
                    this.showPhysicsInfo(sourceEntity);
                    break;

                case "vehicle_test":
                    this.runVehicleTest(sourceEntity);
                    break;

                default:
                    this.sendMessageToPlayer(sourceEntity, "§c[Psybox] 알 수 없는 명령어: " + command);
            }
        } catch (error) {
            console.error(`§c[Psybox] 스크립트 이벤트 처리 실패 (${command}):`, error);
        }
    }

    private sendMessageToPlayer(entity?: Entity, message: string): void {
        if (entity && entity instanceof Player) {
            entity.sendMessage(message);
        } else {
            // 플레이어가 아닌 경우 콘솔에 출력
            console.log(message);
        }
    }

    private runSlopeTest(sourceEntity?: Entity): void {
        try {
            this.sendMessageToPlayer(sourceEntity, "§a[Psybox] 경사면 테스트 시작...");
            this.sendMessageToPlayer(sourceEntity, "§7계단이나 반블럭 경사면에 서보세요!");

            if (sourceEntity?.dimension) {
                const testLocation = {
                    x: sourceEntity.location.x + 2,
                    y: sourceEntity.location.y + 5,
                    z: sourceEntity.location.z
                };

                // car:basic 엔티티 스폰 (타입 캐스팅으로 오류 해결)
                const testEntity = sourceEntity.dimension.spawnEntity("car:basic" as EntityType, testLocation);

                if (testEntity) {
                    this.initializeEntityPhysics(testEntity);

                    system.runTimeout(() => {
                        this.sendMessageToPlayer(sourceEntity, "§e[Psybox] 테스트 완료!");
                    }, 100);
                }
            }
        } catch (error) {
            console.error("§c[Psybox] 경사면 테스트 실패:", error);
            this.sendMessageToPlayer(sourceEntity, "§c[Psybox] 테스트 실행 중 오류 발생");
        }
    }

    private runVehicleTest(sourceEntity?: Entity): void {
        try {
            this.sendMessageToPlayer(sourceEntity, "§a[Psybox] 차량 물리 테스트 시작...");

            if (sourceEntity?.dimension) {
                const testLocation = {
                    x: sourceEntity.location.x + 1,
                    y: sourceEntity.location.y + 2,
                    z: sourceEntity.location.z
                };

                const vehicleEntity = sourceEntity.dimension.spawnEntity("car:basic" as EntityType, testLocation);

                if (vehicleEntity) {
                    // 차량 전용 물리 프로퍼티 설정
                    vehicleEntity.setDynamicProperty("physics:mass", 1500);
                    vehicleEntity.setDynamicProperty("physics:friction", 0.8);
                    vehicleEntity.setDynamicProperty("physics:tire_grip", 0.9);

                    this.initializeEntityPhysics(vehicleEntity);
                    this.sendMessageToPlayer(sourceEntity, "§e[Psybox] 차량 엔티티 생성 완료!");
                }
            }
        } catch (error) {
            console.error("§c[Psybox] 차량 테스트 실패:", error);
        }
    }

    private showPhysicsInfo(sourceEntity?: Entity): void {
        const entityCount = this.physicsEntities.size;
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        this.sendMessageToPlayer(sourceEntity, `§b[Psybox] 물리 엔티티: ${entityCount}개`);
        this.sendMessageToPlayer(sourceEntity, `§b[Psybox] 업데이트 간격: ${deltaTime}ms`);
        this.sendMessageToPlayer(sourceEntity, `§b[Psybox] 디버그 모드: ${this.debugMode ? "§a활성" : "§c비활성"}`);
    }

    private initializeEntityPhysics(entity: Entity): void {
        try {
            if (!entity.isValid) return;

            const physicsData: PhysicsData = {
                velx: 0,
                vely: 0,
                velz: 0,
                isgrounded: false,
                issliding: false,
                slopeangle: 0,
                slopestrength: 0,
                mass: entity.getDynamicProperty("physics:mass") as number || 100,
                friction: entity.getDynamicProperty("physics:friction") as number || 0.7
            };

            this.physicsEntities.set(entity.id, physicsData);

        } catch (error) {
            console.error("§c[Psybox] 엔티티 물리 초기화 실패:", error);
        }
    }

    private updatePhysics(): void {
        const currentTime = Date.now();
        const deltaTime = Math.min((currentTime - this.lastUpdateTime) / 1000, 0.05); // 최대 50ms

        const entitiesToRemove: string[] = []; // Set 대신 배열 사용

        try {
            for (const [entityId, physicsData] of this.physicsEntities) {
                const entity = world.getEntity(entityId);

                if (!entity || !entity.isValid) { // isValid() -> isValid 프로퍼티로 변경
                    entitiesToRemove.push(entityId); // add() -> push() 메서드로 변경
                    continue;
                }

                this.updateEntityPhysics(entity, physicsData, deltaTime);
            }

            // 제거할 엔티티들 처리
            entitiesToRemove.forEach(entityId => {
                this.physicsEntities.delete(entityId);
            });

        } catch (error) {
            console.error("§c[Psybox] 물리 업데이트 실패:", error);
        }

        this.lastUpdateTime = currentTime;
    }

    private updateEntityPhysics(entity: Entity, physicsData: PhysicsData, deltaTime: number): void {
        try {
            // 현재 속도 가져오기
            const currentVelocity = entity.getVelocity();

            // 중력 적용
            const dimension = entity.dimension;
            const gravityMultiplier = this.getDimensionGravityMultiplier(dimension.id);
            physicsData.vely += PHYSICS_CONSTANTS.GRAVITY * gravityMultiplier * deltaTime;

            // 지면 검출
            physicsData.isgrounded = this.checkGroundContact(entity);

            // 경사면 검출 및 미끄러짐 처리
            if (physicsData.isgrounded) {
                const slopeInfo = this.detectSlope(entity);
                physicsData.slopeangle = slopeInfo.angle;
                physicsData.slopestrength = slopeInfo.strength;
                physicsData.issliding = slopeInfo.angle > PHYSICS_CONSTANTS.SLOPE_ANGLE_THRESHOLD;

                if (physicsData.issliding) {
                    this.applySlopePhysics(entity, physicsData, slopeInfo);
                }

                // 지면 마찰 적용
                physicsData.velx *= PHYSICS_CONSTANTS.GROUND_FRICTION;
                physicsData.velz *= PHYSICS_CONSTANTS.GROUND_FRICTION;
                physicsData.vely = Math.max(physicsData.vely, 0); // 지면에서 y속도 제한
            } else {
                // 공중에서 공기 저항 적용
                physicsData.velx *= PHYSICS_CONSTANTS.AIR_RESISTANCE;
                physicsData.velz *= PHYSICS_CONSTANTS.AIR_RESISTANCE;
            }

            // 속도 임펄스 적용 (setVelocity 대신 applyImpulse 사용)
            const velocityDelta = {
                x: physicsData.velx - currentVelocity.x,
                y: physicsData.vely - currentVelocity.y,
                z: physicsData.velz - currentVelocity.z
            };

            // 속도 차이가 있을 때만 impulse 적용
            if (Math.abs(velocityDelta.x) > PHYSICS_CONSTANTS.MIN_VELOCITY_THRESHOLD ||
                Math.abs(velocityDelta.y) > PHYSICS_CONSTANTS.MIN_VELOCITY_THRESHOLD ||
                Math.abs(velocityDelta.z) > PHYSICS_CONSTANTS.MIN_VELOCITY_THRESHOLD) {

                entity.applyImpulse({
                    x: velocityDelta.x * physicsData.mass * 0.1,
                    y: velocityDelta.y * physicsData.mass * 0.1,
                    z: velocityDelta.z * physicsData.mass * 0.1
                });
            }

            // 디버그 HUD 업데이트
            if (this.debugMode) {
                this.updateDebugHUD(entity, physicsData);
            }

        } catch (error) {
            console.error("§c[Psybox] 엔티티 물리 업데이트 실패:", error);
        }
    }

    private checkGroundContact(entity: Entity): boolean {
        try {
            const belowLocation = {
                x: entity.location.x,
                y: entity.location.y - 0.1,
                z: entity.location.z
            };

            const block = entity.dimension.getBlock(belowLocation);
            return block !== undefined && !block.isAir;
        } catch {
            return false;
        }
    }

    private detectSlope(entity: Entity): { angle: number; strength: number } {
        try {
            // 간단한 경사면 검출 (전방과 현재 위치의 높이 차이로 계산)
            const frontLocation = {
                x: entity.location.x + entity.getViewDirection().x,
                y: entity.location.y,
                z: entity.location.z + entity.getViewDirection().z
            };

            const currentBlock = entity.dimension.getBlock(entity.location);
            const frontBlock = entity.dimension.getBlock(frontLocation);

            if (currentBlock && frontBlock) {
                const heightDiff = frontBlock.location.y - currentBlock.location.y;
                const angle = Math.abs(Math.atan(heightDiff) * 180 / Math.PI);
                const strength = Math.min(angle / 45.0, 1.0);

                return { angle, strength };
            }
        } catch (error) {
            console.error("§c[Psybox] 경사면 검출 실패:", error);
        }

        return { angle: 0, strength: 0 };
    }

    private applySlopePhysics(entity: Entity, physicsData: PhysicsData, slopeInfo: { angle: number; strength: number }): void {
        try {
            // 경사면에서 미끄러짐 효과
            const slideForce = slopeInfo.strength * 0.1;
            const viewDirection = entity.getViewDirection();

            physicsData.velx += viewDirection.x * slideForce;
            physicsData.velz += viewDirection.z * slideForce;

            // 최대 속도 제한
            const totalSpeed = Math.sqrt(physicsData.velx ** 2 + physicsData.velz ** 2);
            if (totalSpeed > PHYSICS_CONSTANTS.MAX_VELOCITY) {
                const scale = PHYSICS_CONSTANTS.MAX_VELOCITY / totalSpeed;
                physicsData.velx *= scale;
                physicsData.velz *= scale;
            }

        } catch (error) {
            console.error("§c[Psybox] 경사면 물리 적용 실패:", error);
        }
    }

    private updateDebugHUD(entity: Entity, physicsData: PhysicsData): void {
        try {
            const nearbyPlayers = entity.dimension.getPlayers({
                location: entity.location,
                maxDistance: 10
            });

            nearbyPlayers.forEach(player => {
                const debugText = [
                    `§7위치: §f${entity.location.x.toFixed(1)}, ${entity.location.y.toFixed(1)}, ${entity.location.z.toFixed(1)}`,
                    `§7속도: §f${physicsData.velx.toFixed(2)}, ${physicsData.vely.toFixed(2)}, ${physicsData.velz.toFixed(2)}`,
                    `§7지면: §f${physicsData.isgrounded ? "§a접촉" : "§c공중"}`,
                    `§7경사: §f${physicsData.issliding ? "§e미끄러짐" : "§7평지"} (${physicsData.slopeangle.toFixed(1)}°)`,
                    `§7질량: §f${physicsData.mass}kg §7마찰: §f${physicsData.friction}`
                ].join("\n");

                player.onScreenDisplay.setActionBar(debugText);
            });

        } catch (error) {
            console.error("§c[Psybox] 디버그 HUD 업데이트 실패:", error);
        }
    }
}

// 물리엔진 인스턴스 생성
const physicsEngine = PsyboxPhysicsEngine.getInstance();
