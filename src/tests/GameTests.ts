import { Test, register } from "@minecraft/server-gametest";
import { MinecraftEntityTypes } from "@minecraft/vanilla-data";

register("psybox", "slope_physics", (test: Test) => {
    const testEntity = test.spawn(MinecraftEntityTypes.CarBasic, { x: 2, y: 2, z: 2 });
    
    test.succeedWhen(() => {
        test.assertEntityHasComponent(MinecraftEntityTypes.CarBasic, "minecraft:physics", true);
        test.assertBlockPresent("minecraft:stone_slab", { x: 5, y: 2, z: 5 });
    });

    test.idle(60); // 60틱(3초) 대기
}).maxTicks(60);
