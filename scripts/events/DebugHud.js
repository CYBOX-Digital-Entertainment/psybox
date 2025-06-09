import { system, world } from "@minecraft/server";
import { SlopeDetector } from "../physics/integration/SlopeDetector";
import { BlockCollision } from "../physics/integration/BlockCollision";
/**
 * Script API 2.0.0-beta 호환 디버그 HUD 시스템
 */
// 업데이트 간격 설정 (초당 3회)
const UPDATE_INTERVAL = 7;
// 디버그 HUD 업데이트 루프
system.runInterval(() => {
    try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });
        for (const entity of entities) {
            try {
                // 엔티티 상태 정보 가져오기
                const velocity = entity.getVelocity();
                const isSliding = entity.getDynamicProperty("phys:issliding") || false;
                const slopeAngle = entity.getDynamicProperty("phys:slopeangle") || 0;
                const isGrounded = BlockCollision.checkGroundCollision(entity);
                // 물리 정보 계산
                const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
                const slope = SlopeDetector.getSlopeInfo(entity);
                // 네임태그에 실시간 정보 표시 (컬러 텍스트)
                entity.nameTag = [
                    `§b속도: §f${speed.toFixed(2)}m/s §7(${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)})`,
                    `§b미끄러짐: §f${isSliding ? "§a활성" : "§c비활성"}`,
                    `§b경사: §f${parseFloat(String(slopeAngle)).toFixed(1)}° §7(강도: ${slope.strength.toFixed(2)})`,
                    `§b지면: §f${isGrounded ? "§a접촉" : "§c공중"}`
                ].join('\n');
            }
            catch (entityError) {
                // 개별 엔티티 디버그 오류 무시
            }
        }
    }
    catch (systemError) {
        // 디버그 시스템 오류 무시
    }
}, UPDATE_INTERVAL);
// 초기화 메시지
console.log("물리 디버그 HUD 시스템 초기화 완료");
