import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/SpawnTestEntity";
import "./events/DebugHud";

// cybox:spirra 엔티티의 물리 프로파일 등록
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.5,
  gravityMultiplier: 0.8,
  bounceFactor: 0.6, // 0.3 → 0.6으로 증가
  airResistance: 0.9, // 0.98 → 0.9로 변경
  maxVelocity: { x: 5.0, y: 5.0, z: 5.0 } // 2.0 → 5.0으로 상향
});
