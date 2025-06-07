import { Entity, world, system } from "@minecraft/server";

/**
 * Minecraft 네이티브 물리 컴포넌트를 활용한 경사면 시뮬레이션
 */
export class NativePhysics {
  private static isInitialized = false;
  
  static initializeSliding() {
    if (this.isInitialized) return;
    
    console.log("네이티브 물리 슬라이딩 시스템 초기화");
    
    // 20틱마다 경사면 감지 및 처리
    system.runInterval(() => {
      try {
        const overworld = world.getDimension("overworld");
        const entities = overworld.getEntities({ type: "cybox:spirra" });
        
        for (const entity of entities) {
          this.processNaturalSliding(entity);
        }
      } catch (error) {
        // 오류 무시 (성능 보호)
      }
    }, 20);
    
    this.isInitialized = true;
  }
  
  private static processNaturalSliding(entity: Entity) {
    try {
      if (!entity || !entity.isValid()) return;
      
      const location = entity.location;
      const velocity = entity.getVelocity();
      const overworld = world.getDimension("overworld");
      
      // 발 아래 블록 확인
      const belowBlock = overworld.getBlock({
        x: Math.floor(location.x),
        y: Math.floor(location.y - 0.5),
        z: Math.floor(location.z)
      });
      
      const isOnSlope = this.detectNaturalSlope(belowBlock);
      
      if (isOnSlope) {
        // 자연스러운 미끄러짐 효과 (텔레포트 기반)
        const slideForce = 0.02;
        const newX = location.x + (Math.random() - 0.5) * slideForce;
        const newZ = location.z + (Math.random() - 0.5) * slideForce;
        
        entity.teleport({
          x: newX,
          y: location.y,
          z: newZ
        });
        
        // 상태 업데이트
        entity.setDynamicProperty("phys:issliding", true);
        entity.setDynamicProperty("phys:slopeangle", 15.0);
      } else {
        entity.setDynamicProperty("phys:issliding", false);
        entity.setDynamicProperty("phys:slopeangle", 0.0);
      }
      
      // 속도 정보 업데이트
      entity.setDynamicProperty("phys:velx", velocity.x.toFixed(2));
      entity.setDynamicProperty("phys:vely", velocity.y.toFixed(2));
      entity.setDynamicProperty("phys:velz", velocity.z.toFixed(2));
      
    } catch (error) {
      // 개별 엔티티 처리 오류 무시
    }
  }
  
  private static detectNaturalSlope(block: any): boolean {
    if (!block?.typeId) return false;
    
    // 계단과 반블록 감지
    const slopeBlocks = [
      'minecraft:oak_stairs', 'minecraft:stone_stairs', 'minecraft:brick_stairs',
      'minecraft:oak_slab', 'minecraft:stone_slab', 'minecraft:brick_slab'
    ];
    
    return slopeBlocks.some(blockType => block.typeId.includes(blockType.split(':')[1]));
  }
}

