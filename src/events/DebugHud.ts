import { system, world } from "@minecraft/server";

system.runInterval(() => {
  try {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });
    
    for (const entity of entities) {
      try {
        const velocity = entity.getVelocity();
        const isSliding = entity.getDynamicProperty("phys:issliding") || false;
        const slopeAngle = entity.getDynamicProperty("phys:slopeangle") || 0;
        
        entity.nameTag = [
          `속도: ${Math.sqrt(velocity.x*velocity.x + velocity.z*velocity.z).toFixed(2)}m/s`,
          `미끄러짐: ${isSliding ? "O" : "X"}`,
          `경사: ${Number(slopeAngle).toFixed(1)}°`
        ].join('\n');
        
      } catch (entityError) {
        // 개별 엔티티 디버그 오류 무시
      }
    }
  } catch (systemError) {
    // 디버그 시스템 오류 무시
  }
}, 40); // 2초마다 업데이트
