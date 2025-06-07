import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";

PhysicsComponent.registerEntity("cybox:spirra", {
  mass: 0.8,
  gravityMultiplier: 1.2,
  bounceFactor: 0.2,
  airResistance: 0.85,
  maxVelocity: { x: 3.0, y: 3.0, z: 3.0 }
});
