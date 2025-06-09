import { register } from "@minecraft/server-gametest";
import { Vector3 } from "@minecraft/server";

export class SlopePhysics {
  static registerTests() {
    // 경사면 미끄러짐 테스트
    register("psybox", "slope_test", (test) => {
      // Vector3 객체로 위치 설정
      const pos1: Vector3 = { x: 1, y: 1, z: 1 };
      const pos2: Vector3 = { x: 2, y: 2, z: 1 };
      const pos3: Vector3 = { x: 3, y: 3, z: 1 };

      test.setBlockType("minecraft:oak_stairs", pos1);
      test.setBlockType("minecraft:oak_stairs", pos2);
      test.setBlockType("minecraft:oak_stairs", pos3);

      const spawnPos: Vector3 = { x: 0, y: 3, z: 0 };
      const entity = test.spawn("cybox:spirra", spawnPos);

      test.succeedWhen(() => {
        try {
          const velocity = entity.getVelocity();
          const slopeStrength = entity.getDynamicProperty("phys:slopestrength") as number;

          if (velocity.x > 0.01 || (slopeStrength && slopeStrength > 0.05)) {
            test.succeed();
          }
        } catch (error) {
          console.warn("경사면 테스트 오류:", error);
        }
      });
    })
    .maxTicks(100)
    .structureName("psybox:slope_test");

    // 반블록 테스트
    register("psybox", "slab_test", (test) => {
      const pos1: Vector3 = { x: 1, y: 1, z: 1 };
      const pos2: Vector3 = { x: 2, y: 1, z: 1 };

      test.setBlockType("minecraft:stone_slab", pos1);
      test.setBlockType("minecraft:stone_slab", pos2);

      const spawnPos: Vector3 = { x: 0, y: 3, z: 0 };
      const entity = test.spawn("cybox:spirra", spawnPos);

      test.succeedWhen(() => {
        try {
          const slopeStrength = entity.getDynamicProperty("phys:slopestrength") as number;
          if (slopeStrength && slopeStrength > 0.05) {
            test.succeed();
          }
        } catch (error) {
          console.warn("반블록 테스트 오류:", error);
        }
      });
    })
    .maxTicks(80)
    .structureName("psybox:slab_test");

    // 프로퍼티 동기화 테스트
    register("psybox", "property_sync_test", (test) => {
      const spawnPos: Vector3 = { x: 1, y: 3, z: 1 };
      const entity = test.spawn("cybox:spirra", spawnPos);

      test.succeedWhen(() => {
        try {
          const velX = entity.getDynamicProperty("phys:velx");
          const isSliding = entity.getDynamicProperty("phys:issliding");

          if (velX !== undefined && isSliding !== undefined) {
            test.succeed();
          }
        } catch (error) {
          console.warn("프로퍼티 동기화 테스트 오류:", error);
        }
      });
    })
    .maxTicks(60)
    .structureName("psybox:property_sync_test");

    console.log("✅ GameTest 등록 완료: slope_test, slab_test, property_sync_test");
  }
}

// 자동 등록
SlopePhysics.registerTests();
