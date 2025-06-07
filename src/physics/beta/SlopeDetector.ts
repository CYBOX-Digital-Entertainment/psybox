import { world, Entity, Vector3 } from "@minecraft/server";

export interface SlopeInfo {
  isOnSlope: boolean;
  angle: number;
  direction: Vector3;
  strength: number;
  blockType: string;
}

/**
 * 베타 API 2.1.0 기반 정밀 경사면 감지 시스템
 * 계단, 반블록, 사용자 정의 경사 블록 지원
 */
export class SlopeDetector {
  private static readonly SLOPE_BLOCKS = new Set([
    'minecraft:oak_stairs', 'minecraft:stone_stairs', 'minecraft:brick_stairs',
    'minecraft:quartz_stairs', 'minecraft:cobblestone_stairs', 'minecraft:sandstone_stairs',
    'minecraft:oak_slab', 'minecraft:stone_slab', 'minecraft:brick_slab',
    'minecraft:quartz_slab', 'minecraft:cobblestone_slab', 'minecraft:sandstone_slab'
  ]);

  static detectSlope(entity: Entity): SlopeInfo {
    const location = entity.location;
    const overworld = world.getDimension("overworld");

    // 8방향 경사면 검사 (MACHINE_BUILDER 방식)
    const directions = [
      { vec: { x: 1, y: 0, z: 0 }, name: 'east' },
      { vec: { x: -1, y: 0, z: 0 }, name: 'west' },
      { vec: { x: 0, y: 0, z: 1 }, name: 'south' },
      { vec: { x: 0, y: 0, z: -1 }, name: 'north' },
      { vec: { x: 1, y: 0, z: 1 }, name: 'southeast' },
      { vec: { x: -1, y: 0, z: 1 }, name: 'southwest' },
      { vec: { x: 1, y: 0, z: -1 }, name: 'northeast' },
      { vec: { x: -1, y: 0, z: -1 }, name: 'northwest' }
    ];

    let maxSlope: SlopeInfo = {
      isOnSlope: false,
      angle: 0,
      direction: { x: 0, y: 0, z: 0 },
      strength: 0,
      blockType: 'air'
    };

    for (const dir of directions) {
      const checkPos = {
        x: Math.floor(location.x + dir.vec.x),
        y: Math.floor(location.y - 0.5),
        z: Math.floor(location.z + dir.vec.z)
      };

      try {
        const block = overworld.getBlock(checkPos);
        if (block && this.SLOPE_BLOCKS.has(block.typeId)) {
          const slopeInfo = this.calculateSlopeInfo(location, checkPos, block.typeId, dir.vec);

          if (slopeInfo.strength > maxSlope.strength) {
            maxSlope = slopeInfo;
          }
        }
      } catch (error) {
        // 블록 접근 실패 시 무시
      }
    }

    return maxSlope;
  }

  private static calculateSlopeInfo(entityPos: Vector3, blockPos: Vector3, blockType: string, direction: Vector3): SlopeInfo {
    let heightDiff = 0;
    let distance = 1.0;

    // 블록 타입별 높이 계산
    if (blockType.includes('stairs')) {
      heightDiff = 0.5; // 계단 높이
    } else if (blockType.includes('slab')) {
      heightDiff = 0.25; // 반블록 높이
    }

    // 경사각 계산
    const angle = Math.atan(heightDiff / distance);
    const strength = Math.abs(heightDiff) / distance;

    // 방향 벡터 정규화
    const normalizedDirection = this.normalizeVector({
      x: direction.x * (heightDiff > 0 ? 1 : -1),
      y: 0,
      z: direction.z * (heightDiff > 0 ? 1 : -1)
    });

    return {
      isOnSlope: strength > 0.1, // 최소 경사 임계값
      angle: angle,
      direction: normalizedDirection,
      strength: strength,
      blockType: blockType
    };
  }

  private static normalizeVector(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (length === 0) return { x: 0, y: 0, z: 0 };

    return {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length
    };
  }

  static isSlopeBlock(blockType: string): boolean {
    return this.SLOPE_BLOCKS.has(blockType);
  }

  static getSupportedBlocks(): string[] {
    return Array.from(this.SLOPE_BLOCKS);
  }
}