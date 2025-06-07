import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";

// 엔티티 등록
PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 1.5,
  gravityMultiplier: 0.8,
  bounceFactor: 0.3
