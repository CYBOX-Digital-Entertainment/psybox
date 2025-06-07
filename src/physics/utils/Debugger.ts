// src/physics/utils/Debugger.ts
import { world, system } from "@minecraft/server";

export class PhysicsDebugger {
  static logEntityState(entityId: string) {
    system.runInterval(() => {  // system.runInterval로 변경
      const entity = world.getDimension("overworld")
        .getEntities({ type: entityId })[0];
      if (entity) {
        console.log(`Velocity: ${JSON.stringify(entity.getVelocity())}`);
      }
    }, 1); // 1틱(0.05초) 주기
  }
}

// main.ts 초기화 시 호출
PhysicsDebugger.logEntityState("cybox:spirra");
