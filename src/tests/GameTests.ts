import { 
    register,
    Test,
    SimulatedPlayer
} from "@minecraft/server-gametest";
import { Entity, Vector3, world } from "@minecraft/server";

// Psybox Physics Engine용 GameTest
register("psybox", "basic_physics", (test: Test) => {
    const testEntity = test.spawn("cybox:spirra", { x: 1, y: 2, z: 1 });

    // 엔티티가 정상적으로 스폰되었는지 확인
    test.assertEntityPresent("cybox:spirra", { x: 1, y: 2, z: 1 }, 1);

    // 2초 후 물리 프로퍼티 확인
    test.runAfterDelay(40, () => {
        if (testEntity && testEntity.isValid) {
            const velocity = testEntity.getVelocity();
            test.assert(velocity.y < 0, "중력이 적용되어야 함");

            // 물리 프로퍼티 확인
            const velX = testEntity.getDynamicProperty("psybox:velx") as number;
            const velY = testEntity.getDynamicProperty("psybox:vely") as number;
            const velZ = testEntity.getDynamicProperty("psybox:velz") as number;

            test.assert(typeof velX === "number", "velX 프로퍼티가 설정되어야 함");
            test.assert(typeof velY === "number", "velY 프로퍼티가 설정되어야 함");
            test.assert(typeof velZ === "number", "velZ 프로퍼티가 설정되어야 함");
        }

        test.succeed();
    });
})
.maxTicks(100)
.structureName("psybox:empty_platform");

// 경사면 물리 테스트
register("psybox", "slope_physics", (test: Test) => {
    // 경사면 생성 (계단 형태)
    for (let i = 0; i < 5; i++) {
        test.setBlockType("minecraft:stone", { x: i, y: i, z: 1 });
    }

    // 경사면 위에 테스트 엔티티 스폰
    const testEntity = test.spawn("cybox:spirra", { x: 4, y: 6, z: 1 });

    test.runAfterDelay(60, () => {
        if (testEntity && testEntity.isValid) {
            const isSliding = testEntity.getDynamicProperty("psybox:issliding") as boolean;
            const slopeAngle = testEntity.getDynamicProperty("psybox:slopeangle") as number;

            test.assert(typeof isSliding === "boolean", "경사면 상태가 설정되어야 함");
            test.assert(typeof slopeAngle === "number", "경사각도가 계산되어야 함");

            // 엔티티가 아래로 이동했는지 확인
            const currentLocation = testEntity.location;
            test.assert(currentLocation.y < 6, "엔티티가 경사면에서 미끄러져 내려가야 함");
        }

        test.succeed();
    });
})
.maxTicks(120)
.structureName("psybox:slope_test_platform");

// 지면 감지 테스트
register("psybox", "ground_detection", (test: Test) => {
    // 지면 생성
    test.setBlockType("minecraft:stone", { x: 1, y: 1, z: 1 });

    // 지면 위에 엔티티 스폰
    const testEntity = test.spawn("cybox:spirra", { x: 1, y: 3, z: 1 });

    test.runAfterDelay(40, () => {
        if (testEntity && testEntity.isValid) {
            const isGrounded = testEntity.getDynamicProperty("psybox:isgrounded") as boolean;
            test.assert(typeof isGrounded === "boolean", "지면 감지 상태가 설정되어야 함");
        }

        test.succeed();
    });
})
.maxTicks(80)
.structureName("psybox:ground_test_platform");

// 물리 프로퍼티 설정 테스트
register("psybox", "physics_properties", (test: Test) => {
    const testEntity = test.spawn("cybox:spirra", { x: 1, y: 2, z: 1 });

    test.runAfterDelay(20, () => {
        if (testEntity && testEntity.isValid) {
            // 모든 물리 프로퍼티가 설정되었는지 확인
            const properties = [
                "psybox:velx", "psybox:vely", "psybox:velz",
                "psybox:isgrounded", "psybox:issliding",
                "psybox:slopeangle", "psybox:slopestrength",
                "psybox:mass", "psybox:friction"
            ];

            for (const prop of properties) {
                const value = testEntity.getDynamicProperty(prop);
                test.assert(value !== undefined, `${prop} 프로퍼티가 설정되어야 함`);
            }
        }

        test.succeed();
    });
})
.maxTicks(60)
.structureName("psybox:basic_platform");

// 속도 적용 시스템 테스트
register("psybox", "velocity_system", (test: Test) => {
    const testEntity = test.spawn("cybox:spirra", { x: 1, y: 5, z: 1 });

    let initialY = 0;

    test.runAfterDelay(10, () => {
        if (testEntity && testEntity.isValid) {
            initialY = testEntity.location.y;
        }
    });

    test.runAfterDelay(50, () => {
        if (testEntity && testEntity.isValid) {
            const currentY = testEntity.location.y;
            test.assert(currentY < initialY, "엔티티가 중력에 의해 아래로 이동해야 함");

            const velocity = testEntity.getVelocity();
            test.assert(Math.abs(velocity.x) < 2, "수평 속도가 적절한 범위 내에 있어야 함");
            test.assert(Math.abs(velocity.z) < 2, "수평 속도가 적절한 범위 내에 있어야 함");
        }

        test.succeed();
    });
})
.maxTicks(100)
.structureName("psybox:fall_test_platform");