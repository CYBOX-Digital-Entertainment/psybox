import { Test, register } from "@minecraft/server-gametest";

register("psybox", "slope_physics", (test: Test) => {
    // 1. 테스트 엔티티 생성
    const testEntity = test.spawn("car:basic", { x: 2, y: 2, z: 2 });
    
    // 2. 테스트 조건 설정
    test.succeedWhen(() => {
        test.assertEntityHasComponent(testEntity, "minecraft:physics", true);
        test.assertBlockPresent("minecraft:stone_slab", { x: 5, y: 2, z: 5 });
    });
    
    // 3. 60틱(3초) 대기
    test.idle(60);
}).maxTicks(60); // 최대 실행 시간 설정
