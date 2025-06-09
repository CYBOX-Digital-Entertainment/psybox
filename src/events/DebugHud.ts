import { system, world } from "@minecraft/server";
import { SlopeDetector } from "../physics/integration/SlopeDetector";

system.runInterval(() => {
  try {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });

    for (const entity of entities) {
      try {
        if (!entity.isValid()) continue;

        const velocity = entity.getVelocity();
        const slope = SlopeDetector.getSlopeInfo(entity);
        const isSliding = entity.getDynamicProperty("phys:issliding") || false;
        const slopeAngle = entity.getDynamicProperty("phys:slopeangle") || 0;

        // 네임태그 업데이트
        entity.nameTag = [
          `속도: ${Math.sqrt(velocity.x*velocity.x + velocity.z*velocity.z).toFixed(2)}m/s`,
          `미끄러짐: ${isSliding ? "🟢 O" : "🔴 X"}`,
          `경사: ${Number(slopeAngle).toFixed(1)}°`,
          `강도: ${slope.strength.toFixed(2)}`
        ].join('\n');

      } catch (entityError) {
        // 개별 엔티티 디버그 오류 무시
      }
    }
  } catch (systemError) {
    // 디버그 시스템 오류 무시
  }
}, 40); // 2초마다 업데이트
