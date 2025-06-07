import { world, Entity, Vector3 } from "@minecraft/server";

/**
 * 계단/반블록을 포함한 블록 충돌 검출 시스템
 */
export class BlockCollision {
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:oak_stairs', 'minecraft:stone_slab',
    'minecraft:cobblestone_stairs', 'minecraft:birch_slab', 'minecraft:oak_slab',
    'minecraft:brick_stairs', 'minecraft:quartz_stairs', 'minecraft:cobblestone_slab',
    'minecraft:dirt', 'minecraft:cobblestone', 'minecraft:planks'
  ]);

  static checkGroundCollision(entity: Entity): boolean {
    const pos = entity.location;
    const feetPos: Vector3 = {
      x: pos.x,
      y: pos.y - 0.1, // 발 위치 정확히 계산
      z: pos.z
    };
    
    try {
      const block = world.getDimension("overworld").getBlock(feetPos);
      return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
    } catch (e) {
      return false;
    }
  }

  static isSolidBlock(pos: Vector3): boolean {
    try {
      const block = world.getDimension("overworld").getBlock(pos);
      return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
    } catch (e) {
      return false;
    }
  }
}
