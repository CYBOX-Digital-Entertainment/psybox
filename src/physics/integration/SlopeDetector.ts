import { world, Entity, Vector3 } from "@minecraft/server";

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
    
    // 더 정밀한 4방향 검출
    const directions = [
      { vec: { x: 0.8, y: 0, z: 0 }, name: 'x+' },
      { vec: { x: -0.8, y: 0, z: 0 }, name: 'x-' },
      { vec: { x: 0, y: 0, z: 0.8 }, name: 'z+' },
      { vec: { x: 0, y: 0, z: -0.8 }, name: 'z-' }
    ];
    
    let maxSlope = { angle: 0, direction: { x: 0, y: 0, z: 0 }, strength: 0 };
    
    for (const dir of directions) {
      const checkPos = {
        x: Math.floor(pos.x + dir.vec.x),
        y: Math.floor(pos.y),
        z: Math.floor(pos.z + dir.vec.z)
      };
      
      try {
        const block = overworld.getBlock(checkPos);
        const heightDiff = this.calculateAccurateBlockHeight(block, pos) - pos.y;
        
        if (Math.abs(heightDiff) > 0.1) { // 임계값 증가
          const distance = Math.sqrt(dir.vec.x**2 + dir.vec.z**2);
          const angle = Math.atan(heightDiff / distance);
          const strength = Math.abs(heightDiff) / distance;
          
          if (strength > maxSlope.strength) {
            maxSlope = {
              angle: angle,
              direction: this.normalizeVector({ 
                x: heightDiff > 0 ? -dir.vec.x : dir.vec.x,
                y: 0,
                z: heightDiff > 0 ? -dir.vec.z : dir.vec.z
              }),
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
  
  private static calculateAccurateBlockHeight(block: any, entityPos: Vector3): number {
    if (!block?.typeId) return entityPos.y;
    
    const baseY = block.y;
    
    // 반블록 처리 (정확히 0.5 높이)
    if (this.SLAB_BLOCKS.has(block.typeId)) {
      return baseY + 0.5;
    }
    
    // 계단 처리 (0.5 높이이지만 방향 고려)
    if (this.STEP_BLOCKS.has(block.typeId)) {
      return baseY + 0.5;
    }
    
    // 일반 블록 (1.0 높이)
    return baseY + 1.0;
  }
  
  private static normalizeVector(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
    return length > 0 ? { x: v.x/length, y: v.y/length, z: v.z/length } : { x: 0, y: 0, z: 0 };
  }
}
