import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";
import { BetaSlopePhysics } from "./physics/beta/SlopePhysics";

// Script API 2.0.0-beta - Watchdog 종료 방지
system.beforeEvents.watchdogTerminate.subscribe((event) => {
  event.cancel = true;
  console.warn("🛡️ Watchdog 종료 방지: " + event.terminateReason);
});

// 물리 프로파일 등록 (베타 API 2.0.0 기준)
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 0.8,
  gravityMultiplier: 1.5,
  bounceFactor: 0.2,
  airResistance: 0.85,
  maxVelocity: { x: 6.0, y: 10.0, z: 6.0 },
  slopeForce: 0.15,
  frictionCoefficient: 0.1
});

// Script API 2.0.0-beta - 월드 로드 이벤트 사용
world.afterEvents.worldLoad.subscribe(() => {
  console.log("🌍 월드 로드 완료 - 물리엔진 초기화");

  try {
    BetaSlopePhysics.initialize();
    console.log("✅ 베타 경사면 물리 시스템 활성화");
  } catch (error) {
    console.error("❌ 물리 시스템 초기화 실패:", error);
  }
});

// 스크립트 이벤트 핸들러 (베타 API 2.0.0)
system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "psybox:init") {
    console.log("🚀 Psybox 물리엔진 수동 초기화 완료");
  }

  if (event.id === "psybox:debug") {
    const entities = world.getDimension("overworld").getEntities({ type: "cybox:spirra" });
    console.log(`📊 활성 Spirra 엔티티: ${entities.length}개`);
  }
});

// 성능 모니터링 시스템
let performanceCounter = 0;
system.runInterval(() => {
  performanceCounter++;

  if (performanceCounter % 100 === 0) {
    try {
      const overworld = world.getDimension("overworld");
      const entities = overworld.getEntities({ type: "cybox:spirra" });
      console.log(`📈 성능 체크 - 활성 엔티티: ${entities.length}개, 틱: ${performanceCounter}`);

      if (entities.length > 15) {
        console.warn("⚠️ 엔티티 수가 많습니다. 성능 저하 가능성");
      }
    } catch (error) {
      // 성능 모니터링 오류는 무시
    }
  }
}, 1);

console.log("🎯 Psybox Physics Engine v2.0.0-beta - Script API 2.0.0-beta 로드 완료");
