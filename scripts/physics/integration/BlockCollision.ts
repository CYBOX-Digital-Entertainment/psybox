import { world } from "@minecraft/server";

export class BlockCollision {
  static isSolidBlock(pos: { x: number, y: number, z: number }): boolean {
    const block = world.getDimension("overworld").getBlock(pos);
    if (!block) return false;
    
    const solidBlocks = [
      "minecraft:stone", "minecraft:dirt", 
      "minecraft:cobblestone", "minecraft:planks"
    ];
    return solidBlocks.includes(block.typeId);
  }
}
