import { register } from "@minecraft/server-gametest";
export class BetaSlopePhysics {
    static registerTests() {
        // 경사면 테스트 (블록 상태 문자열 사용)
        register("psybox", "slope_test", (test) => {
            // 계단 블록 설정 (2개 인자만 사용)
            test.setBlockType({ x: 1, y: 1, z: 1 }, "minecraft:oak_stairs");
            test.setBlockType({ x: 2, y: 2, z: 1 }, "minecraft:oak_stairs");
            test.setBlockType({ x: 3, y: 3, z: 1 }, "minecraft:oak_stairs");
            // 엔티티 소환
            const entity = test.spawn("cybox:spirra", { x: 0, y: 3, z: 0 });
            // 테스트 성공 조건 (메시지 인자 제거)
            test.succeedWhen(() => {
                const velocity = entity.getVelocity();
                const slopeStrength = entity.getDynamicProperty("phys:slopestrength");
                if (velocity.x > 0.01 || slopeStrength > 0.05) {
                    test.succeed(); // 인자 없음
                }
            });
        })
            .maxTicks(100)
            .structureName("psybox:slope_test");
        // 반블록 테스트
        register("psybox", "slab_test", (test) => {
            // 반블록 설정 (블록 상태 포함)
            test.setBlockType({ x: 1, y: 1, z: 1 }, "minecraft:stone_slab");
            test.setBlockType({ x: 2, y: 1, z: 1 }, "minecraft:stone_slab");
            const entity = test.spawn("cybox:spirra", { x: 0, y: 3, z: 0 });
            test.succeedWhen(() => {
                const slopeStrength = entity.getDynamicProperty("phys:slopestrength");
                if (slopeStrength > 0.05) {
                    test.succeed(); // 인자 없음
                }
            });
        })
            .maxTicks(80)
            .structureName("psybox:slab_test");
        // 프로퍼티 동기화 테스트
        register("psybox", "property_sync_test", (test) => {
            const entity = test.spawn("cybox:spirra", { x: 1, y: 2, z: 1 });
            test.succeedWhen(() => {
                const velx = entity.getDynamicProperty("phys:velx");
                const issliding = entity.getDynamicProperty("phys:issliding");
                if (velx !== undefined && issliding !== undefined) {
                    test.succeed(); // 인자 없음
                }
            });
        })
            .maxTicks(60)
            .structureName("psybox:property_sync_test");
        console.log("✅ GameTest 등록 완료: slope_test, slab_test, property_sync_test");
    }
}
