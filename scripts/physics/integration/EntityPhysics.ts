import { world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
// 추후 충돌 체크, 블록 충돌 등도 여기에 추가 가능

// 매 틱마다 엔티티에 물리 효과 적용
world.events.tick.subscribe(() => {
  for (const entity of world.getDimension("overworld").getEntities()) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (profile) {
      const body = new RigidBody(entity, profile);
      ForceManager.applyGravity(body);
      ForceManager.applyAirResistance(body);
      // 블록 충돌, 엔티티 충돌 등 추가 가능
    }
  }
});
