import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/SpawnTestEntity";
import "./events/DebugHud";

// cybox:spirra 엔티티의 물리 프로파일 등록
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.5,
  gravityMultiplier: 0.8,
  bounceFactor: 0.7,
  airResistance: 0.95,
  maxVelocity: { x: 5.0, y: 5.0, z: 5.0 }
});
