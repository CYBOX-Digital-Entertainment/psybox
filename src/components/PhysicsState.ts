import { Entity } from "@minecraft/server";
import { BlockCollision } from "../physics/integration/BlockCollision";

export class PhysicsState {
  static update(entity: Entity) {
    const velocity = entity.getVelocity();
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    
    entity.setDynamicProperty("phys:velX", velocity.x.toFixed(2));
    entity.setDynamicProperty("phys:velY", velocity.y.toFixed(2));
    entity.setDynamicProperty("phys:velZ", velocity.z.toFixed(2));
    entity.setDynamicProperty("phys:isGrounded", isGrounded ? 1 : 0);
  }
}
