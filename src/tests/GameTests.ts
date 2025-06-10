import { Test, register } from "@minecraft/server-gametest";

register("psybox", "slope_physics", (test: Test) => {
    const testEntity = test.spawn("car:basic", { x: 2, y: 2, z: 2 });
    
    test.succeedWhen(() => {
        test.assertEntityHasComponent(
            "car:basic", 
            "minecraft:physics", 
            { x: 2, y: 2, z: 2 }, // 블록 위치 추가
            true
        );
    });
    
    test.idle(60);
});
