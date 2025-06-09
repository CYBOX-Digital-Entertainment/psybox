import { system, world } from "@minecraft/server";
import { SlopeDetector } from "../physics/integration/SlopeDetector";

export class DebugHud {
  static initialize() {
    // 20틱마다 디버그 정보 업데이트
    system.runInterval(() => {
      try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });

        for (const entity of entities) {
          try {
            const debugEnabled = entity.getDynamicProperty("debug_hud") as boolean;
            if (!debugEnabled) continue;

            const velocity = entity.getVelocity();
            const slope = SlopeDetector.getSlopeInfo(entity);

            // 타입 캐스팅으로 오류 해결
            const isSliding = entity.getDynamicProperty("phys:issliding") as boolean;
            const slopeAngle = entity.getDynamicProperty("phys:slopeangle") as number;
            const slopeStrength = entity.getDynamicProperty("phys:slopestrength") as number;
            const isGrounded = entity.getDynamicProperty("phys:isgrounded") as boolean;

            // 상태별 이모지
            let slopeEmoji = "⚪"; // 평지
            if (slopeStrength > 0.3) slopeEmoji = "🔴"; // 급경사
            else if (slopeStrength > 0.15) slopeEmoji = "🟡"; // 중간경사
            else if (slopeStrength > 0.05) slopeEmoji = "🟢"; // 완만한경사

            const slidingEmoji = isSliding ? "🟢" : "🔴";
            const groundEmoji = isGrounded ? "🟢" : "🔴";

            // 네임태그 업데이트
            entity.nameTag = [
              `§b속도: §f${Math.sqrt(velocity.x*velocity.x + velocity.z*velocity.z).toFixed(2)}m/s`,
              `§e미끄러짐: ${slidingEmoji}`,
              `§6경사: ${slopeEmoji} ${(slopeAngle || 0).toFixed(1)}°`,
              `§a지면: ${groundEmoji}`,
              `§d강도: §f${(slopeStrength || 0).toFixed(3)}`
            ].join('\n');

          } catch (entityError) {
            // 개별 엔티티 오류 무시
          }
        }
      } catch (systemError) {
        // 시스템 오류 무시
      }
    }, 20);

    console.log("✅ 디버그 HUD 시스템 초기화 완료");
  }
}

// 자동 초기화
DebugHud.initialize();
