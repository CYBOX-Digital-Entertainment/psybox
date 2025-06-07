import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { BetaPhysicsEngine } from "./physics/beta/BetaPhysicsEngine";
import { WatchdogManager } from "./physics/beta/WatchdogManager";
import "./events/DebugHud";
/**
 * Cybox Spirra Physics Engine v2.1.0
 * Script API 2.1.0-beta 기반 경사면 물리 시뮬레이션
 *
 * 특징:
 * - MACHINE_BUILDER 스타일 자연스러운 미끄러짐
 * - MajestikButter Physics-Test 부드러운 물리 효과
 * - Script Watchdog 완전 무력화
 * - 베타 API 2.1.0 최신 기능 활용
 */
// Early Execution으로 빠른 초기화 (베타 API 2.1.0 신기능)
system.beforeEvents.startup.subscribe(() => {
    console.log("🚀 Cybox Spirra Physics Engine - Early Startup");
    // Watchdog 시스템 무력화
    WatchdogManager.disableWatchdog();
    // 물리 프로파일 등록
    PhysicsComponent.registerEntity("cybox:spirra", {
        mass: 0.8,
        gravityMultiplier: 1.5,
        bounceFactor: 0.2,
        airResistance: 0.85,
        maxVelocity: { x: 8.0, y: 12.0, z: 8.0 },
        slopeForce: 0.15,
        frictionCoefficient: 0.05
    });
    console.log("✅ Physics Profile Registered");
});
// 월드 로딩 완료 후 물리엔진 초기화 (베타 API 2.1.0 변경사항)
world.afterEvents.worldLoad.subscribe(() => {
    console.log("🌍 World Load Complete - Initializing Physics Engine");
    try {
        // 베타 물리엔진 초기화
        BetaPhysicsEngine.initialize();
        console.log("✅ Beta Physics Engine Initialized");
        // 시스템 상태 확인
        system.runTimeout(() => {
            const entities = world.getDimension("overworld").getEntities({ type: "cybox:spirra" });
            console.log(`📊 System Status: ${entities.length} active entities`);
        }, 100);
    }
    catch (error) {
        console.error("❌ Physics Engine Initialization Failed:", error);
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
            console.log(`📈 Performance Check - Entities: ${entities.length}, Ticks: ${performanceCounter}`);
            if (entities.length > 20) {
                console.warn("⚠️ High entity count detected. Consider performance optimization.");
            }
        }
        catch (error) {
            // 성능 모니터링 오류 무시
        }
    }
}, 1);
console.log("Cybox Spirra Physics Engine v2.1.0 - Beta API Ready");
