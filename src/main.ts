import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/DebugHud";

// 더 반응성 좋은 물리 프로파일
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 0.8,                    // 가벼운 질량으로 빠른 반응
  gravityMultiplier: 1.5,       // 강한 중력
  bounceFactor: 0.2,            // 낮은 반발력
  airResistance: 0.80,          // 낮은 공기저항으로 빠른 가속
  maxVelocity: { x: 6.0, y: 10.0, z: 6.0 }  // 높은 최대 속도
});

console.log("Cybox Spirra Physics Engine v2.1 - 경사면 최적화 완료");
