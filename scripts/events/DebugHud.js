import { system, world } from "@minecraft/server";
/**
 * 실시간 디버그 HUD 시스템
 */
let debugEnabled = false;
system.afterEvents.scriptEventReceive.subscribe(({ id }) => {
    if (id === "psybox:debug_on") {
        debugEnabled = true;
        world.sendMessage("§a[PSYBOX] 디버그 HUD 활성화됨");
    }
    else if (id === "psybox:debug_off") {
        debugEnabled = false;
        world.sendMessage("§c[PSYBOX] 디버그 HUD 비활성화됨");
    }
});
// 1초마다 디버그 HUD 업데이트
system.runInterval(() => {
    if (!debugEnabled)
        return;
    try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ families: ["psybox"] });
        for (const entity of entities) {
            // entity.isValid 메서드 호출 방식 수정
            if (!entity || !(typeof entity.isValid === "function" ? entity.isValid() : true))
                continue;
            const velocity = entity.getVelocity();
            const isSliding = entity.getDynamicProperty("phys:issliding");
            const slopeAngle = entity.getDynamicProperty("phys:slopeangle");
            const slopeStrength = entity.getDynamicProperty("phys:slopestrength");
            const isGrounded = entity.getDynamicProperty("phys:isgrounded");
            // 상태별 이모지
            let slideEmoji = isSliding ? "🟢" : "🔴";
            let groundEmoji = isGrounded ? "🟢" : "🔴";
            let slopeEmoji = "⚪";
            if (slopeStrength > 0.3)
                slopeEmoji = "🔴"; // 급경사
            else if (slopeStrength > 0.15)
                slopeEmoji = "🟡"; // 중간경사
            else if (slopeStrength > 0.05)
                slopeEmoji = "🟢"; // 완만한경사
            // 네임태그 업데이트
            entity.nameTag = [
                `속도: ${Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z).toFixed(2)}m/s`,
                `높이: ${velocity.y.toFixed(2)}m/s`,
                `미끄러짐: ${slideEmoji} | 지면: ${groundEmoji}`,
                `경사: ${slopeAngle ? slopeAngle.toFixed(1) : "0.0"}° ${slopeEmoji}`
            ].join('\n');
        }
    }
    catch (error) {
        console.warn("[PSYBOX] 디버그 HUD 오류:", error);
    }
}, 20);
console.log("✅ 디버그 HUD 시스템 로드 완료");
