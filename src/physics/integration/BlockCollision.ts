import { world, Entity, Vector3, Block } from "@minecraft/server";

export class BlockCollision {
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:dirt', 'minecraft:cobblestone',
    'minecraft:planks', 'minecraft:bedrock', 'minecraft:glass'
  ]);

  // 블록 ID 검사 메서드
  static isSolidBlock(pos: Vector3): boolean {
    const block = world.getDimension('overworld').getBlock(pos);
    return block ? this.SOLID_BLOCKS.has(block.typeId) : false; // id → typeId로 수정
  }

  // 바닥 충돌 검출 메서드 (정적 메서드로 명시)
  static checkGroundCollision(entity: Entity): boolean {
    const feetPos: Vector3 = {
      x: entity.location.x,
      y: entity.location.y - 0.5,
      z: entity.location.z
    };
    return this.isSolidBlock(feetPos);
  }
}
