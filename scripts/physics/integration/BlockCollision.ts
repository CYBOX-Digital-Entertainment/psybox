// src/physics/integration/BlockCollision.ts
export class BlockCollision {
  static checkGroundCollision(entity: Entity): boolean {
    const pos = entity.getBlockFromViewDirection()?.block;
    return pos ? BlockCollision.isSolidBlock(pos) : false;
  }
}
