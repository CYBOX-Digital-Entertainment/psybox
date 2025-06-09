import { world, Entity, system, Vector3 } from "@minecraft/server";
import { register } from "@minecraft/server-gametest";
import { SlopeDetector } from "../integration/SlopeDetector";
import { BlockCollision } from "../integration/BlockCollision";
import { ForceManager } from "../core/ForceManager";
import { RigidBody } from "../core/RigidBody";
import { PhysicsComponent } from "../../components/PhysicsComponent";

/**
 * Script API 2.0.0-beta 및 GameTest 1.0.0-beta 호환 경사면 물리 시스템
 */
export class BetaSlopePhysics {
  private static isInitialized = false;

  /**
   * 경사면 물리 시스템 초기화
   */
  static initialize() {
    if (this.isInitialized) return;

    console.log("경사면 물리 시스템 초기화");

    // GameTest 프레임워크 등록
    this.registerTests();

    // 경사면 슬라이딩 시스템 활성화
    system.runInterval(() => {
      try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });

        for (const entity of entities) {
          // 강제 미끄러짐 효과
          this.applySlopeEffect(entity);
        }
      } catch (error) {
        // 오류 무시 (성능 보호)
      }
    }, 20);

    this.isInitialized = true;
  }

  /**
   * GameTest 프레임워크 테스트 등록 (베타 1.0.0)
   */
  private static registerTests() {
    try {
      register("psybox", "slope_test", (test) => {
        // 경사면 생성
        test.setBlockType("minecraft:oak_stairs", { x: 1, y: 0, z: 1 });

        // 엔티티 생성
        const entity = test.spawn("cybox:spirra", { x: 1, y: 3, z: 1 });

        // 성공 조건
        test.succeedWhenEntityPresent("cybox:spirra", { x: 1, y: 1, z: 1 }, true);
      })
      .maxTicks(100)
      .structureName("psybox:slope_test")
      .rotateTest(true);

      console.log("경사면 테스트 등록 완료");

    } catch (error) {
      console.warn("GameTest 등록 실패:", error);
    }
  }

  /**
   * 경사면 물리 효과 직접 적용
   * @param entity 대상 엔티티
   */
  private static applySlopeEffect(entity: Entity) {
    try {
      if (!entity || !entity.isValid()) return;

      const location = entity.location;
      const overworld = world.getDimension("overworld");

      // 발 아래 블록 확인
      const belowBlock = overworld.getBlock({
        x: Math.floor(location.x),
        y: Math.floor(location.y) - 1,
        z: Math.floor(location.z)
      });

      if (!belowBlock) return;

      const isOnSlope = 
        belowBlock.typeId.includes('stairs') || 
        belowBlock.typeId.includes('slab');

      if (isOnSlope) {
        // 전체 물리 시스템으로 처리
        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile) return;

        const body = new RigidBody(entity, profile);
        const slope = SlopeDetector.getSlopeInfo(entity);

        if (slope.strength > 0.05) {
          ForceManager.applySlopePhysics(body, slope);
          entity.setDynamicProperty("phys:issliding", true);
        }
      }

    } catch (error) {
      // 개별 엔티티 처리 오류 무시
    }
  }
}
