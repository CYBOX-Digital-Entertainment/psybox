import { world, Entity, Vector3 } from "@minecraft/server";

/**
 * Script API 2.0.0-beta 호환 블록 충돌 검출 시스템
 */
export class BlockCollision {
  // 계단/반블록 포함 고체 블록 목록
  private static readonly SOLID_BLOCKS = new Set([
    'minecraft:stone', 'minecraft:oak_stairs', 'minecraft:stone_slab',
    'minecraft:cobblestone_stairs', 'minecraft:birch_slab', 'minecraft:oak_slab',
    'minecraft:brick_stairs', 'minecraft:quartz_stairs', 'minecraft:cobblestone_slab',
    'minecraft:dirt', 'minecraft:cobblestone', 'minecraft:planks'
  ]);

  /**
   * 엔티티 발 아래 블록과의 충돌 여부 확인
   * @param entity 대상 엔티티
   * @returns 지면과 충돌 여부
   */
  static checkGroundCollision(entity: Entity): boolean {
    try {
      const pos = entity.location;
      const feetPos: Vector3 = {
        x: pos.x,
        y: pos.y - 0.1, // 발 위치 정확히 계산
        z: pos.z
      };

      const block = world.getDimension("overworld").getBlock(feetPos);
      return block ? this.SOLID_BLOCKS.has(block.typeId) : false;

    } catch (e) {
      return false;
    }
  }

  /**
   * 특정 위치의 블록이 고체인지 확인
   * @param pos 검사할 위치
   * @returns 고체 블록 여부
   */
  static isSolidBlock(pos: Vector3): boolean {
    try {
      const block = world.getDimension("overworld").getBlock(pos);
      return block ? this.SOLID_BLOCKS.has(block.typeId) : false;
    } catch (e) {
      return false;
    }
  }

  /**
   * 특정 위치의 블록이 계단인지 확인
   * @param pos 검사할 위치
   * @returns 계단 여부
   */
  static isStairBlock(pos: Vector3): boolean {
    try {
      const block = world.getDimension("overworld").getBlock(pos);
      return block ? block.typeId.includes('stairs') : false;
    } catch (e) {
      return false;
    }
  }

  /**
   * 특정 위치의 블록이 반블록인지 확인
   * @param pos 검사할 위치
   * @returns 반블록 여부
   */
  static isSlabBlock(pos: Vector3): boolean {
    try {
      const block = world.getDimension("overworld").getBlock(pos);
      return block ? block.typeId.includes('slab') : false;
    } catch (e) {
      return false;
    }
  }
}
