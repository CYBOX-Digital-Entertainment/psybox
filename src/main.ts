import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";

// Script API 2.0.0-beta Early Execution
world.afterEvents.worldLoad.subscribe(() => {
  console.log("🚀 Cybox Spirra Physics Engine v2.0.0-beta 초기화 완료");

  try {
    // 물리 프로파일 등록
    PhysicsComponent.registerEntity("cybox:spirra", {
      mass: 0.8,
      gravityMultiplier: 1.5,
      bounceFactor: 0.2,
      airResistance: 0.85,
      maxVelocity: { x: 6.0, y: 10.0, z: 6.0 }
    });

    console.log("✅ 물리 프로파일 등록 완료");
  } catch (error) {
    console.warn("⚠️ 물리 프로파일 등록 실패:", error);
  }
});

// Script Event 처리 (2.0.0-beta 호환)
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;

  if (sourceEntity && sourceEntity.typeId === "minecraft:player") {
    system.run(() => {
      if (id === "psybox:debug_on") {
        world.sendMessage("§a디버그 HUD 활성화됨");
        sourceEntity.setDynamicProperty("psybox:debug_enabled", true);
      } else if (id === "psybox:debug_off") {
        world.sendMessage("§c디버그 HUD 비활성화됨");
        sourceEntity.setDynamicProperty("psybox:debug_enabled", false);
      } else if (id === "psybox:debug_detailed") {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });
        world.sendMessage(`§e활성 엔티티 수: ${entities.length}개`);
      }
    });
  }
});

// 성능 모니터링 시스템
let performanceCounter = 0;
system.runInterval(() => {
  performanceCounter++;

  if (performanceCounter % 200 === 0) {
    try {
      const overworld = world.getDimension("overworld");
      const entities = overworld.getEntities({ type: "cybox:spirra" });

      if (entities.length > 0) {
        console.log(`📊 물리 엔진 상태 - 활성 엔티티: ${entities.length}개`);
      }

      if (entities.length > 15) {
        console.warn("⚠️ 엔티티 수가 많습니다. 성능 저하 가능성");
      }
    } catch (error) {
      console.warn("📊 성능 모니터링 오류:", error);
    }
  }
}, 1);

console.log("Cybox Spirra Physics Engine - Script API 2.0.0-beta 호환 버전 로드 완료");
