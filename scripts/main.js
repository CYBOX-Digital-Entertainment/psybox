import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";
import { SlopePhysicsTest } from "./physics/beta/SlopePhysics";
// Script API 2.0.0-beta에서는 watchdogTerminate가 제거되었으므로 삭제
// 대신 성능 모니터링 시스템으로 대체
// 물리 프로파일 등록
PhysicsComponent.registerEntity("cybox:spirra", {
    mass: 0.8,
    gravityMultiplier: 1.5,
    bounceFactor: 0.2,
    airResistance: 0.80,
    maxVelocity: { x: 6.0, y: 10.0, z: 6.0 }
});
// Script API 2.0.0-beta 호환 월드 초기화 이벤트
world.afterEvents.worldInitialize.subscribe(() => {
    console.log("🚀 Psybox Physics Engine v2.0.0-beta 초기화 완료");
    // GameTest 등록
    try {
        SlopePhysicsTest.registerTests();
        console.log("✅ GameTest 등록 완료");
    }
    catch (error) {
        console.warn("⚠️ GameTest 등록 실패:", error);
    }
});
// 성능 모니터링 시스템 (Watchdog 대체)
let performanceCounter = 0;
system.runInterval(() => {
    performanceCounter++;
    if (performanceCounter % 100 === 0) {
        try {
            const overworld = world.getDimension("overworld");
            const entities = overworld.getEntities({ type: "cybox:spirra" });
            console.log(`📊 시스템 상태 - 활성 엔티티: ${entities.length}개`);
        }
        catch (error) {
            // 오류 무시 (성능 보호)
        }
    }
}, 1);
console.log("Psybox Physics Engine - Script API 2.0.0-beta 로드 완료");
