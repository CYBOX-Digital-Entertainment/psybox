import { world, Entity, Vector3 } from "@minecraft/server";

/**
 * MACHINE_BUILDER 방식의 레이캐스트 기반 경사면 검출
 * 계단/반블록의 정확한 높이 계산 지원
 */
export class SlopeDetector {
  private static readonly STEP_BLOCKS = new Set([
    'minecraft:oak_stairs', 'minecraft:stone_stairs', 'minecraft:brick_stairs',
    'minecraft:quartz_stairs', 'minecraft:cobblestone_stairs'
  ]);
  
  private static readonly SLAB_BLOCKS = new Set([
    'minecraft:oak_slab', 'minecraft:stone_slab', 'minecraft:brick_slab',
    'minecraft:quartz_slab', 'minecraft:cobblestone_slab'
  ]);

  static getSlopeInfo(entity: Entity): { angle: number, direction: Vector3, strength: number } {
    const pos = entity.location;
    const overworld = world.getDimension("overworld");
    
    // 4방향 검출 (MACHINE_BUILDER 방식)
    const directions = [
      { vec: { x: 0.6, y: 0, z: 0 }, name: 'x+' },
      { vec: { x: -0.6, y: 0, z: 0 }, name: 'x-' },
      { vec: { x: 0, y: 0, z: 0.6 }, name: 'z+' },
      { vec: { x: 0, y: 0, z: -0.6 }, name: 'z-' }
    ];
    
    let maxSlope = { angle: 0, direction: { x: 0, y: 0, z: 0 }, strength: 0 };
    
    for (const dir of directions) {
      const checkPos = {
        x: pos.x + dir.vec.x,
        y: Math.floor(pos.y),
        z: pos.z + dir.vec.z
      };
      
      try {
        const block = overworld.getBlock(checkPos);
        const heightDiff = this.calculateBlockHeight(block, pos.y) - pos.y;
        
        if (Math.abs(heightDiff) > 0.05) {
          const angle = Math.atan(heightDiff / 0.6);
          const strength = Math.abs(Math.sin(angle));
          
          if (strength > maxSlope.strength) {
            maxSlope = {
              angle: angle,
              direction: this.normalizeVector(dir.vec),
              strength: strength
            };
          }
        }
      } catch (e) {
        console.warn("SlopeDetector: Block access failed", e);
      }
    }
    
    return maxSlope;
  }
  
  private static calculateBlockHeight(block: any, entityY: number): number {
    if (!block?.typeId) return entityY;
    
    const baseY = block.y;
    
    // 계단 블록 처리
    if (this.STEP_BLOCKS.has(block.typeId)) {
      return baseY + 0.5; // 계단 높이
    }
    
    // 반블록 처리  
    if (this.SLAB_BLOCKS.has(block.typeId)) {
      return baseY + 0.5; // 반블록 높이
    }
    
    // 일반 블록
    return baseY + 1.0;
  }
  
  private static normalizeVector(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    return length > 0 ? { x: v.x/length, y: v.y/length, z: v.z/length } : { x: 0, y: 0, z: 0 };
  }
}
