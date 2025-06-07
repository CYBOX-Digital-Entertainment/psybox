// src/physics/integration/BlockCollision.ts
import { Entity, Vector3 } from "@minecraft/server";

export class BlockCollision {
  static checkGroundCollision(entity: Entity): boolean {
    const pos = entity.getBlockFromViewDirection()?.block;
    if (!pos) return false;
    
    const feetPos: Vector3 = {
      x: entity.location.x,
      y: entity.location.y - 0.5,
      z: entity.location.z
    };
    
    return this.isSolidBlock(feetPos);
  }
}
