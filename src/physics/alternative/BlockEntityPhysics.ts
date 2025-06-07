import { Entity, world, system, ItemStack } from "@minecraft/server";

/**
 * Block Entities를 활용한 경사면 물리 시뮬레이션
 */
export class BlockEntityPhysics {
  private static markerEntities = new Map<string, Entity>();

  static initialize() {
    console.log("블록 엔티티 물리 시스템 초기화");
    
    // 10틱마다 마커 엔티티 기반 물리 처리
    system.runInterval(() => {
      this.processBlockEntityPhysics();
    }, 10);
  }

  private static processBlockEntityPhysics() {
    try {
      const overworld = world.getDimension("overworld");
      const entities = overworld.getEntities({ type: "cybox:spirra" });
      
      for (const entity of entities) {
        const pos = entity.location;
        
        // 투명한 마커 엔티티로 경사면 효과 시뮬레이션
        const markerId = `slope_marker_${Math.floor(pos.x)}_${Math.floor(pos.z)}`;
        
        if (!this.markerEntities.has(markerId)) {
          // 마커 엔티티 생성 (Armor Stand 사용)
          try {
            const marker = overworld.spawnEntity("minecraft:armor_stand", {
              x: Math.floor(pos.x) + 0.5,
              y: pos.y - 0.5,
              z: Math.floor(pos.z) + 0.5
            });
            
            // 투명하게 설정
            marker.runCommand("data merge entity @s {Invisible:1b,Marker:1b}");
            this.markerEntities.set(markerId, marker);
            
          } catch (error) {
            console.warn("마커 엔티티 생성 실패:", error);
          }
        }
        
        // 실제 물리 효과 적용
        this.applySlopeEffect(entity, pos);
      }
    } catch (error) {
      console.warn("블록 엔티티 물리 처리 오류:", error);
    }
  }

  private static applySlopeEffect(entity: Entity, pos: any) {
    try {
      // 경사면 감지 및 텔레포트 기반 이동
      const overworld = world.getDimension("overworld");
      const belowBlock = overworld.getBlock({ x: pos.x, y: pos.y - 1, z: pos.z });
      
      if (belowBlock?.typeId?.includes('stairs')) {
        // 계단에서 미끄러짐
        entity.teleport({
          x: pos.x + 0.02,
          y: pos.y,
          z: pos.z + 0.02
        });
        
        entity.setDynamicProperty("phys:issliding", true);
        
      } else if (belowBlock?.typeId?.includes('slab')) {
        // 반블록에서 미끄러짐
        entity.teleport({
          x: pos.x + 0.01,
          y: pos.y,
          z: pos.z + 0.01
        });
        
        entity.setDynamicProperty("phys:issliding", true);
      } else {
        entity.setDynamicProperty("phys:issliding", false);
      }
      
    } catch (error) {
      console.warn("경사면 효과 적용 오류:", error);
    }
  }

  static cleanup() {
    // 마커 엔티티 정리
    for (const [id, entity] of this.markerEntities) {
      try {
        entity.remove();
      } catch (error) {
        console.warn(`마커 엔티티 제거 실패 (${id}):`, error);
      }
    }
    this.markerEntities.clear();
  }
}
