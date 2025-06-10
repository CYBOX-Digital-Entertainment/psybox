
import {
    register,
    Test
} from "@minecraft/server-gametest";
import { Entity, world } from "@minecraft/server";
import { PsyboxPhysicsEngine } from "../main";

/**
 * Register and implement physics tests
 */
register("psybox", "basic_physics", (test: Test) => {
    // Test setup
    const testEntity = test.spawn("car:basic", { x: 2, y: 2, z: 2 });    

    // Test that entity has been created
    test.assert(testEntity !== undefined, "Entity should be spawned");

    // Set physics properties
    testEntity.setDynamicProperty("physics:mass", 100);
    testEntity.setDynamicProperty("physics:friction", 0.5);

    // Test that gravity is applied
    test.runAfterDelay(20, () => {
        const velocity = testEntity.getVelocity();
        // Expect entity to be falling
        test.assert(velocity.y < 0, "Entity should be falling");

        // Test complete
        test.succeed();
    });
}).maxTicks(100);

register("psybox", "slope_physics", (test: Test) => {
    // Create a slope (stairs)
    const stairs = "minecraft:oak_stairs";
    for (let i = 0; i < 3; i++) {
        test.setBlockType(stairs, { x: i, y: 1, z: 0 });
    }

    // Spawn test entity on top of stairs
    const testEntity = test.spawn("car:basic", { x: 1, y: 3, z: 1 });    

    // Test that entity moves down the slope
    test.runAfterDelay(40, () => {
        const position = testEntity.location;

        // Entity should have moved down the slope
        test.assert(
            position.y < 3 || position.x !== 1 || position.z !== 1,
            "Entity should move down the slope"
        );

        test.succeed();
    });
}).maxTicks(100);

register("psybox", "gravity_test", (test: Test) => {
    // Spawn entity high in the air
    const testEntity = test.spawn("car:basic", { x: 2, y: 3, z: 2 });    

    // Wait a moment
    test.runAfterDelay(10, () => {
        // Get initial velocity
        const velocity1 = testEntity.getVelocity();

        // Wait a bit longer
        test.runAfterDelay(10, () => {
            // Get updated velocity
            const velocity2 = testEntity.getVelocity();

            // Verify gravity is increasing downward velocity
            test.assert(
                velocity2.y < velocity1.y,
                "Gravity should increase downward velocity"
            );

            test.succeed();
        });
    });
}).maxTicks(100);

register("psybox", "friction_test", (test: Test) => {
    // Create different surfaces
    test.setBlockType("minecraft:stone", { x: 1, y: 1, z: 1 });
    test.setBlockType("minecraft:ice", { x: 3, y: 1, z: 3 });

    // Spawn entity on stone
    const testEntity = test.spawn("car:basic", { x: 1, y: 2, z: 1 });   

    // Apply horizontal impulse
    testEntity.applyImpulse({ x: 0.5, y: 0, z: 0.5 });

    // Test that friction slows it down
    test.runAfterDelay(20, () => {
        const velocity = testEntity.getVelocity();

        // Expect horizontal velocity to be reduced
        test.assert(
            Math.abs(velocity.x) < 0.5 && Math.abs(velocity.z) < 0.5,
            "Friction should reduce horizontal velocity"
        );

        test.succeed();
    });
}).maxTicks(100);

register("psybox", "properties_test", (test: Test) => {
    // Create a slope for testing
    test.setBlockType("minecraft:oak_stairs", { x: 3, y: 1, z: 3 });

    // Spawn entity above slope
    const testEntity = test.spawn("car:basic", { x: 3, y: 5, z: 3 });   

    // Set custom physics properties
    testEntity.setDynamicProperty("physics:mass", 2000); // Heavy
    testEntity.setDynamicProperty("physics:friction", 0.2); // Slippery

    // Wait for entity to land on slope
    test.runAfterDelay(30, () => {
        // Check if properties are properly set
        const mass = testEntity.getDynamicProperty("physics:mass");
        const friction = testEntity.getDynamicProperty("physics:friction");

        test.assert(mass === 2000, "Mass should be 2000");
        test.assert(friction === 0.2, "Friction should be 0.2");

        // Check dynamic properties set by physics engine
        test.runAfterDelay(10, () => {
            const isGrounded = testEntity.getDynamicProperty("physics:isgrounded");
            test.assert(isGrounded === true, "Entity should be grounded");

            test.succeed();
        });
    });
}).maxTicks(100);
