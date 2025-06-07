// physics/integration/BlockCollision.ts
import { world, Block } from "@minecraft/server";

class BlockCollisionDetector {
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:dirt', /* ... */
  ]);

  static checkCollision(position: Vector3): boolean {
    const block = world.getDimension('overworld')
      .getBlock(position);
    return block && this.SOLID_BLOCKS.has(block.typeId);
  }
}
