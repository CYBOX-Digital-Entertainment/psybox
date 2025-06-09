import { system, world } from "@minecraft/server";

let debugEnabled = true;

system.runInterval(() => {
  if (!debugEnabled) return;

  try {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });

    for (const entity of entities) {
      try {
        if (!entity.isValid) continue;

        const velocity = entity.getVelocity();
        const isSliding = entity.getDynamicProperty("phys:issliding") as boolean;
        const slopeAngle = entity.getDynamicProperty("phys:slopeangle") as number;
        const slopeStrength = entity.getDynamicProperty("phys:slopestrength") as number;
        const isGrounded = entity.getDynamicProperty("phys:isgrounded") as boolean;

        // 속도 계산
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);

        // 이모지 상태 표시
        let slidingEmoji = isSliding ? "🟢" : "🔴";
        let groundEmoji = isGrounded ? "🟢" : "🔴";
        let slopeEmoji = "⚪";

        if (slopeStrength && typeof slopeStrength === 'number') {
          if (slopeStrength > 0.3) slopeEmoji = "🔴"; // 급경사
          else if (slopeStrength > 0.15) slopeEmoji = "🟡"; // 중간경사
          else if (slopeStrength > 0.05) slopeEmoji = "🟢"; // 완만한경사
        }

        // 네임태그 업데이트
        entity.nameTag = [
          `속도: ${speed.toFixed(2)}m/s`,
          `미끄러짐: ${slidingEmoji}`,
          `경사: ${(slopeAngle || 0).toFixed(1)}° ${slopeEmoji}`,
          `지면: ${groundEmoji}`
        ].join('\n');

        // 속도 프로퍼티 업데이트
        entity.setDynamicProperty("phys:velx", Number(velocity.x.toFixed(3)));
        entity.setDynamicProperty("phys:vely", Number(velocity.y.toFixed(3)));
        entity.setDynamicProperty("phys:velz", Number(velocity.z.toFixed(3)));

      } catch (entityError) {
        // 개별 엔티티 디버그 오류 무시
      }
    }
  } catch (systemError) {
    // 디버그 시스템 오류 무시
  }
}, 40); // 2초마다 업데이트

// 디버그 토글
system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "psybox:debug_toggle") {
    debugEnabled = !debugEnabled;
    world.sendMessage(debugEnabled ? "§a디버그 HUD 활성화" : "§c디버그 HUD 비활성화");
  }
});

console.log("✅ 디버그 HUD 시스템 초기화 완료");
