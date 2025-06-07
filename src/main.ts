import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";

// MACHINE_BUILDER 스타일의 물리 프로파일
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.0,                    // 적절한 질량
  gravityMultiplier: 1.2,       // 강한 중력 (빠른 반응)
  bounceFactor: 0.3,            // 적당한 반발력
  airResistance: 0.88,          // 낮은 공기저항 (자연스러운 가속)
  maxVelocity: { x: 4.0, y: 8.0, z: 4.0 }  // 현실적인 최대 속도
});

console.log("Cybox Spirra Physics Engine v2.0 - 초기화 완료");
