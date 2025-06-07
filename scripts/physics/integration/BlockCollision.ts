import { world } from "@minecraft/server";

export class BlockCollision {
  static isSolidBlock(pos: { x: number, y: number, z: number }): boolean {
    const block = world.getDimension("overworld").getBlock(pos);
    if (!block) return false;
    // 간단 예시: 주요 고체 블록만 체크
    const solidBlocks = [
      "minecraft:stone", "minecraft:dirt", "minecraft:cobblestone",
      "minecraft:planks", "minecraft:bedrock", "minecraft:glass"
    ];
    return solidBlocks.includes(block.typeId);
  }
}
