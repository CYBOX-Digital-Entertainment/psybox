import { world, Entity, Vector3 } from "@minecraft/server";

export class BlockCollision {
  static checkGroundCollision(entity: Entity): boolean {
    const feetPos: Vector3 = {
      x: entity.location.x,
      y: entity.location.y - 0.5,
      z: entity.location.z
    };
    return this.isSolidBlock(feetPos);
  }

  private static isSolidBlock(pos: Vector3): boolean {
    const block = world.getDimension("overworld").getBlock(pos);
    return block?.typeId === "minecraft:stone"; // 예시: stone 블록만 고체로 판정
  }
}
