import { register } from "@minecraft/server-gametest";
/**
 * GameTest 프레임워크 통합 - Script API 2.0.0-beta 호환
 */
export class SlopePhysics {
    static registerTests() {
        // 계단 경사면 미끄러짐 테스트
        register("psybox", "slope_test", (test) => {
            // 계단 블록 생성 (올바른 매개변수 순서로 수정)
            test.setBlockType("minecraft:oak_stairs[facing=east]", { x: 1, y: 1, z: 1 });
            test.setBlockType("minecraft:oak_stairs[facing=east]", { x: 2, y: 2, z: 1 });
            test.setBlockType("minecraft:oak_stairs[facing=east]", { x: 3, y: 3, z: 1 });
            // 평평한 바닥 생성
            test.setBlockType("minecraft:stone", { x: 0, y: 0, z: 0 });
            test.setBlockType("minecraft:stone", { x: 1, y: 0, z: 1 });
            test.setBlockType("minecraft:stone", { x: 2, y: 0, z: 1 });
            // 엔티티 소환
            const entity = test.spawn("cybox:spirra", { x: 0, y: 3, z: 0 });
            // 물리 테스트
            test.runAfterDelay(40, () => {
                // 5초 후 엔티티 위치 확인
                const pos = entity.location;
                const vel = entity.getVelocity();
                // 미끄러짐 상태 확인
                const isSliding = entity.getDynamicProperty("phys:issliding");
                const slopeStrength = entity.getDynamicProperty("phys:slopestrength");
                if (vel.x > 0.01 || pos.x > 0.5) {
                    // 성공: 엔티티가 미끄러졌음
                    test.succeed();
                }
            });
        }).structureName("psybox:slope_test");
        // 반블록 경사면 테스트
        register("psybox", "slab_test", (test) => {
            // 반블록 생성 (올바른 매개변수 순서로 수정)
            test.setBlockType("minecraft:stone_slab[type=bottom]", { x: 1, y: 1, z: 1 });
            test.setBlockType("minecraft:stone_slab[type=top]", { x: 2, y: 1, z: 1 });
            // 평평한 바닥 생성
            test.setBlockType("minecraft:stone", { x: 0, y: 0, z: 0 });
            test.setBlockType("minecraft:stone", { x: 1, y: 0, z: 1 });
            // 엔티티 소환
            const entity = test.spawn("cybox:spirra", { x: 0, y: 3, z: 0 });
            // 물리 테스트
            test.runAfterDelay(60, () => {
                const slopeStrength = entity.getDynamicProperty("phys:slopestrength");
                if (slopeStrength > 0.05) {
                    // 성공: 경사면 감지
                    test.succeed();
                }
            });
        }).structureName("psybox:slab_test");
        // 물리 프로퍼티 동기화 테스트
        register("psybox", "property_sync_test", (test) => {
            // 엔티티 소환
            const entity = test.spawn("cybox:spirra", { x: 1, y: 3, z: 1 });
            // 물리 프로퍼티 확인
            test.runAfterDelay(20, () => {
                const velx = entity.getDynamicProperty("phys:velx");
                const isSliding = entity.getDynamicProperty("phys:issliding");
                const mass = entity.getDynamicProperty("phys:mass");
                if (velx !== undefined && isSliding !== undefined && mass !== undefined) {
                    // 성공: 모든 프로퍼티 정의됨
                    test.succeed();
                }
            });
        }).structureName("psybox:basic_test");
    }
}
