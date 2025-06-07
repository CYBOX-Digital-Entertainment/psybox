import { PhysicsComponent } from "./components/PhysicsComponent";
import "./physics/integration/EntityPhysics";
import "./events/SpawnTestEntity";
// cybox:spirra 엔티티에 물리 프로파일 등록
PhysicsComponent.registerEntity("cybox:spirra", {
    mass: 1.5,
    gravityMultiplier: 0.8,
    bounceFactor: 0.3,
    airResistance: 0.98,
    maxVelocity: { x: 2.0, y: 2.0, z: 2.0 }
});
