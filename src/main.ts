import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";
import { NativePhysics } from "./physics/native/NativePhysics";

// 콘솔 오류 필터링 (명령어 오류 억제)
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (!message.includes('runCommand') && !message.includes('execute')) {
    originalConsoleError.apply(console, args);
  }
};

// 물리 프로파일 등록
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 0.8,
  gravityMultiplier: 1.5,
  bounceFactor: 0.2,
  airResistance: 0.80,
  maxVelocity: { x: 6.0, y: 10.0, z: 6.0 }
});

// 네이티브 물리 시스템 초기화
system.run(() => {
  console.log("🚀 Cybox Spirra Physics Engine v4.0 - 네이티브 물리 초기화");
  
  try {
    NativePhysics.initializeSliding();
    console.log("✅ 네이티브 경사면 물리 시스템 활성화");
  } catch (error) {
    console.warn("⚠️ 네이티브 물리 초기화 실패:", error);
  }
});

// 성능 모니터링 (Watchdog 대체)
let performanceCounter = 0;
system.runInterval(() => {
  performanceCounter++;
  
  if (performanceCounter % 100 === 0) {
    try {
      const overworld = world.getDimension("overworld");
      const entities = overworld.getEntities({ type: "cybox:spirra" });
      console.log(`📊 시스템 상태 - 활성 엔티티: ${entities.length}개`);
    } catch (error) {
      // 오류 무시
    }
  }
}, 1);

console.log("Cybox Spirra Physics Engine - 1.21.82 안정화 버전 로드 완료");
