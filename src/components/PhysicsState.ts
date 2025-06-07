import { Entity } from "@minecraft/server";
import { BlockCollision } from "../physics/integration/BlockCollision";

export class PhysicsState {
  static update(entity: Entity) {
    const velocity = entity.getVelocity();
    const isgrounded = BlockCollision.checkGroundCollision(entity);
    
    entity.setDynamicProperty("phys:isgrounded", isgrounded ? 1 : 0);
  }
}
