import { register } from "@minecraft/server-gametest";

export class SlopePhysicsTest {
  static registerTests() {
    // GameTest 등록 (올바른 임포트 사용)
    register("psybox", "slope_test", (test) => {
      console.log("🧪 Slope Physics 테스트 시작");

      try {
        // 엔티티 소환
        const entity = test.spawn("cybox:spirra", { x: 1, y: 3, z: 1 });

        // 경사면 블록 설정
        test.setBlockType({ x: 0, y: 1, z: 0 }, "minecraft:oak_stairs", 0);
        test.setBlockType({ x: 1, y: 2, z: 1 }, "minecraft:oak_stairs", 0);

        // 테스트 성공 조건
        test.succeedWhen(() => {
          const velocity = entity.getVelocity();
          const hasMovement = Math.abs(velocity.x) > 0.01 || Math.abs(velocity.z) > 0.01;

          if (hasMovement) {
            test.succeed("✅ 경사면 물리가 정상 작동합니다!");
          } else {
            console.log("대기 중... 속도:", velocity);
          }
        });

      } catch (error) {
        console.error("테스트 오류:", error);
        test.fail("❌ 테스트 실행 중 오류 발생");
      }
    })
    .maxTicks(200)
    .structureName("psybox:slope_test");
  }
}
