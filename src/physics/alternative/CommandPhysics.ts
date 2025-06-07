import { Entity, world, system } from "@minecraft/server";

/**
 * Script API 한계를 우회하는 명령어 기반 물리 시뮬레이션
 */
export class CommandPhysics {
  private static activeEntities = new Set<string>();

  static initialize() {
    // 5틱마다 명령어 기반 물리 적용
    system.runInterval(() => {
      const overworld = world.getDimension("overworld");
      for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
        this.applyCommandBasedPhysics(entity);
      }
    }, 5);
  }

  private static applyCommandBasedPhysics(entity: Entity) {
    const entityId = entity.id;
    
    try {
      // 계단에서의 미끄러짐 효과
      entity.runCommand(`execute @s ~ ~ ~ detect ~ ~-1 ~ oak_stairs 0 tp @s ~0.1 ~ ~0.1`);
      entity.runCommand(`execute @s ~ ~ ~ detect ~ ~-1 ~ stone_stairs 0 tp @s ~0.1 ~ ~0.1`);
      
      // 반블록에서의 미끄러짐 효과
      entity.runCommand(`execute @s ~ ~ ~ detect ~ ~-1 ~ stone_slab 0 tp @s ~0.05 ~ ~0.05`);
      entity.runCommand(`execute @s ~ ~ ~ detect ~ ~-1 ~ oak_slab 0 tp @s ~0.05 ~ ~0.05`);
      
      // 중력 시뮬레이션
      entity.runCommand(`execute @s ~ ~ ~ detect ~ ~-1 ~ air 0 tp @s ~ ~-0.2 ~`);
      
      // 상태 추적
      this.activeEntities.add(entityId);
      
    } catch (error) {
      console.warn(`CommandPhysics 오류 (${entityId}):`, error);
    }
  }

  static getActiveEntityCount(): number {
    return this.activeEntities.size;
  }
}
