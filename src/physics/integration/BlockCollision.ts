import { world, Entity, Vector3 } from "@minecraft/server";

export class BlockCollision {
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:dirt', 'minecraft:cobblestone',
    'minecraft:planks', 'minecraft:bedrock', 'minecraft:glass'
  ]);

  static isSolidBlock(pos: Vector3): boolean {
    const block = world.getDimension('overworld').getBlock(pos);
    return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
  }

  static checkGroundCollision(entity: Entity): boolean {
    const feetPos: Vector3 = {
      x: entity.location.x,
      y: entity.location.y - 0.5,
      z: entity.location.z
    };
    return this.isSolidBlock(feetPos);
  }
}
