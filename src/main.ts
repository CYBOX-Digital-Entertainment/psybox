import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/SpawnTestEntity";
import "./events/DebugHud";

// cybox:spirra 엔티티의 물리 프로파일 등록 (반발력, 공기저항 등 상향)
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.5,
  gravityMultiplier: 0.8,
  bounceFactor: 0.7, // 튕김 효과를 위해 0.7로 상향
  airResistance: 0.95, // 공기저항 약간 강화
  maxVelocity: { x: 5.0, y: 5.0, z: 5.0 }
});
