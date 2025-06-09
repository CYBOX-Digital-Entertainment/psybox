import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";
// Script API 2.0.0-beta의 worldLoad 이벤트 사용
world.afterEvents.worldInitialize.subscribe(() => {
    console.log("🚀 Psybox Physics Engine v2.0.0-beta 초기화 시작");
    // 물리 프로파일 등록
    PhysicsComponent.registerEntity("cybox:spirra", {
        mass: 1.0,
        gravityMultiplier: 1.2,
        bounceFactor: 0.3,
        airResistance: 0.85,
        maxVelocity: { x: 6.0, y: 10.0, z: 6.0 },
        slopeForce: 0.15,
        frictionCoefficient: 0.2
    });
    console.log("✅ 물리 프로파일 등록 완료");
});
// Script Event 처리 (2.0.0-beta 방식)
system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity }) => {
    switch (id) {
        case "psybox:debug_on":
            if (sourceEntity) {
                sourceEntity.setDynamicProperty("debug_hud", true);
                sourceEntity.sendMessage("§a디버그 HUD 활성화됨");
            }
            break;
        case "psybox:debug_off":
            if (sourceEntity) {
                sourceEntity.setDynamicProperty("debug_hud", false);
                sourceEntity.sendMessage("§c디버그 HUD 비활성화됨");
            }
            break;
        case "psybox:test_slope":
            console.log("수동 경사면 테스트 실행");
            break;
    }
});
// 성능 모니터링 시스템
let performanceCounter = 0;
system.runInterval(() => {
    performanceCounter++;
    if (performanceCounter % 200 === 0) { // 10초마다
        try {
            const overworld = world.getDimension("overworld");
            const entities = overworld.getEntities({ type: "cybox:spirra" });
            console.log(`📊 시스템 상태 - 활성 엔티티: ${entities.length}개`);
            if (entities.length > 15) {
                console.warn("⚠️ 엔티티 수가 많습니다. 성능 저하 가능성");
            }
        }
        catch (error) {
            console.warn("성능 모니터링 오류:", error);
        }
    }
}, 1);
console.log("Psybox Physics Engine v2.0.0-beta - Script API 2.0.0 호환 버전");
