import { world, Entity, Vector3 } from "@minecraft/server";

// 블록 충돌 검출 유틸리티
export class BlockCollision {
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:dirt', 'minecraft:cobblestone',
    'minecraft:planks', 'minecraft:bedrock', 'minecraft:glass'
  ]);

  static isSolidBlock(pos: Vector3): boolean {
    try {
      const block = world.getDimension('overworld').getBlock(pos);
      return block?.typeId ? this.SOLID_BLOCKS.has(block.typeId) : false;
    } catch (e) {
      console.error("BlockCollision Error:", e);
      return false;
    }
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
