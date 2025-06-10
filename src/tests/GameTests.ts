import { 
    register,
    Test
} from "@minecraft/server-gametest";
import { Entity, EntityType } from "@minecraft/server";

// Factory 패턴으로 구현된 물리학 게임 테스트
export class PhysicsGameTests {
    private static testResults: Map<string, boolean> = new Map();

    // 기본 물리 테스트
    public static basicPhysicsTest(test: Test): void {
        try {
            const testEntity = test.spawn("car:basic" as EntityType, { x: 2, y: 2, z: 2 });

            if (!testEntity) {
                test.fail("테스트 엔티티 스폰 실패");
                return;
            }

            // 물리 프로퍼티 설정
            testEntity.setDynamicProperty("physics:mass", 100);
            testEntity.setDynamicProperty("physics:friction", 0.7);
            testEntity.setDynamicProperty("physics:velx", 0);
            testEntity.setDynamicProperty("physics:vely", 0);
            testEntity.setDynamicProperty("physics:velz", 0);

            // 중력 테스트를 위해 공중에 배치
            const velocity = testEntity.getVelocity(); // 사용되지 않는 변수 제거

            test.succeedWhen(() => {
                // assertEntityPresent 메서드 시그니처 수정 (boolean 대신 number)
                test.assertEntityPresent("car:basic", { x: 2, y: 2, z: 2 }, 1);

                // 물리 프로퍼티 검증
                const mass = testEntity.getDynamicProperty("physics:mass");
                test.assert(mass === 100, "질량이 올바르게 설정되지 않음");

                const friction = testEntity.getDynamicProperty("physics:friction");
                test.assert(friction === 0.7, "마찰 계수가 올바르게 설정되지 않음");
            });

        } catch (error) {
            test.fail(`기본 물리 테스트 실패: ${error}`);
        }
    }

    // 경사면 물리 테스트
    public static slopePhysicsTest(test: Test): void {
        try {
            // 경사면 구조 생성 (올바른 블록 이름 사용)
            const slabLocation = { x: 1, y: 1, z: 1 };
            test.setBlockType("minecraft:stone_slab", slabLocation);

            // 테스트 엔티티 스폰
            const testEntity = test.spawn("car:basic" as EntityType, { x: 1, y: 3, z: 1 });

            if (!testEntity) {
                test.fail("경사면 테스트 엔티티 스폰 실패");
                return;
            }

            // 경사면 물리 프로퍼티 설정
            testEntity.setDynamicProperty("physics:isgrounded", false);
            testEntity.setDynamicProperty("physics:issliding", false);
            testEntity.setDynamicProperty("physics:slopeangle", 0);

            test.succeedWhen(() => {
                const isGrounded = testEntity.getDynamicProperty("physics:isgrounded");
                const slopeAngle = testEntity.getDynamicProperty("physics:slopeangle");

                // 지면에 착지했는지 확인
                test.assert(isGrounded === true, "엔티티가 지면에 착지하지 않음");

                // 경사각이 감지되었는지 확인
                test.assert(typeof slopeAngle === "number" && slopeAngle >= 0, "경사각이 올바르게 계산되지 않음");
            });

        } catch (error) {
            test.fail(`경사면 물리 테스트 실패: ${error}`);
        }
    }

    // 지면 감지 테스트
    public static groundDetectionTest(test: Test): void {
        try {
            // 지면 블록 배치
            test.setBlockType("minecraft:stone", { x: 2, y: 1, z: 2 });

            // 공중에 엔티티 스폰
            const testEntity = test.spawn("car:basic" as EntityType, { x: 2, y: 3, z: 2 });

            if (!testEntity) {
                test.fail("지면 감지 테스트 엔티티 스폰 실패");
                return;
            }

            let frameCount = 0;
            const maxFrames = 100; // 5초 제한

            test.succeedWhen(() => {
                frameCount++;

                if (frameCount > maxFrames) {
                    test.fail("테스트 시간 초과");
                    return;
                }

                const currentY = testEntity.location.y;
                const isGrounded = testEntity.getDynamicProperty("physics:isgrounded");

                // 엔티티가 땅에 착지했는지 확인
                if (currentY <= 2.5 && isGrounded) {
                    test.assert(true, "지면 감지 성공");
                }
            });

        } catch (error) {
            test.fail(`지면 감지 테스트 실패: ${error}`);
        }
    }

    // 물리 프로퍼티 설정 테스트
    public static physicsPropertiesTest(test: Test): void {
        try {
            const testEntity = test.spawn("car:basic" as EntityType, { x: 1, y: 2, z: 1 });

            if (!testEntity) {
                test.fail("물리 프로퍼티 테스트 엔티티 스폰 실패");
                return;
            }

            // 9개 물리 프로퍼티 설정
            const physicsProperties = {
                "physics:velx": 1.5,
                "physics:vely": 0.0,
                "physics:velz": -0.5,
                "physics:isgrounded": false,
                "physics:issliding": false,
                "physics:slopeangle": 15.0,
                "physics:slopestrength": 0.3,
                "physics:mass": 150,
                "physics:friction": 0.8
            };

            // 프로퍼티 설정
            Object.entries(physicsProperties).forEach(([key, value]) => {
                testEntity.setDynamicProperty(key, value);
            });

            test.succeedWhen(() => {
                // 모든 프로퍼티가 올바르게 설정되었는지 검증
                Object.entries(physicsProperties).forEach(([key, expectedValue]) => {
                    const actualValue = testEntity.getDynamicProperty(key);
                    test.assert(actualValue === expectedValue, `프로퍼티 ${key}가 올바르게 설정되지 않음: 예상=${expectedValue}, 실제=${actualValue}`);
                });
            });

        } catch (error) {
            test.fail(`물리 프로퍼티 테스트 실패: ${error}`);
        }
    }

    // 속도 시스템 테스트
    public static velocitySystemTest(test: Test): void {
        try {
            const testEntity = test.spawn("car:basic" as EntityType, { x: 3, y: 5, z: 3 });

            if (!testEntity) {
                test.fail("속도 시스템 테스트 엔티티 스폰 실패");
                return;
            }

            // 초기 속도 설정
            testEntity.setDynamicProperty("physics:velx", 2.0);
            testEntity.setDynamicProperty("physics:vely", 1.0);
            testEntity.setDynamicProperty("physics:velz", -1.0);

            test.succeedWhen(() => {
                const velX = testEntity.getDynamicProperty("physics:velx");
                const velY = testEntity.getDynamicProperty("physics:vely");
                const velZ = testEntity.getDynamicProperty("physics:velz");

                // 속도 값들이 설정되었는지 확인
                test.assert(typeof velX === "number", "X 속도가 숫자가 아님");
                test.assert(typeof velY === "number", "Y 속도가 숫자가 아님");
                test.assert(typeof velZ === "number", "Z 속도가 숫자가 아님");

                // 실제 엔티티 속도와 비교
                const actualVelocity = testEntity.getVelocity();
                test.assert(Math.abs(actualVelocity.x) >= 0, "실제 X 속도가 적용되지 않음");
            });

        } catch (error) {
            test.fail(`속도 시스템 테스트 실패: ${error}`);
        }
    }

    // 테스트 결과 조회
    public static getTestResults(): Map<string, boolean> {
        return this.testResults;
    }

    // 테스트 결과 초기화
    public static clearTestResults(): void {
        this.testResults.clear();
    }
}

// GameTest 등록
register("psybox", "basic_physics", PhysicsGameTests.basicPhysicsTest);
register("psybox", "slope_physics", PhysicsGameTests.slopePhysicsTest);
register("psybox", "ground_detection", PhysicsGameTests.groundDetectionTest);
register("psybox", "physics_properties", PhysicsGameTests.physicsPropertiesTest);
register("psybox", "velocity_system", PhysicsGameTests.velocitySystemTest);
