import { Entity } from "@minecraft/server";
import { BlockCollision } from "../physics/integration/BlockCollision";

export class PhysicsState {
  static update(entity: Entity) {
    const velocity = entity.getVelocity();
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    
    entity.setDynamicProperty("phys:isGrounded", isGrounded ? 1 : 0);
  }
}
