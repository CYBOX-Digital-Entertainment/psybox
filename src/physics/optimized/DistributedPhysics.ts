import { Entity, world, system } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";

/**
 * Script Watchdog 문제를 방지하는 분산 물리 처리 시스템
 */
export class DistributedPhysics {
  private static entityQueue: Entity[] = [];
  private static currentIndex = 0;
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) return;
    
    console.log("분산 물리 엔진 초기화 시작");
    
    // 20틱마다 엔티티 큐 업데이트 (성능 보호)
    system.runInterval(() => {
      try {
        const overworld = world.getDimension("overworld");
        this.entityQueue = overworld.getEntities({ type: "cybox:spirra" });
        console.log(`물리 엔티티 큐 업데이트: ${this.entityQueue.length}개`);
      } catch (error) {
        console.warn("엔티티 큐 업데이트 실패:", error);
      }
    }, 20);

    // 매 2틱마다 한 엔티티씩만 처리 (Watchdog 방지)
    system.runInterval(() => {
      if (this.entityQueue.length > 0) {
        const entity = this.entityQueue[this.currentIndex];
        if (entity && entity.isValid()) {
          this.processEntityPhysics(entity);
        }
        this.currentIndex = (this.currentIndex + 1) % this.entityQueue.length;
      }
    }, 2);

    this.isInitialized = true;
    console.log("분산 물리 엔진 초기화 완료");
  }

  private static processEntityPhysics(entity: Entity) {
    try {
      const profile = PhysicsComponent.getProfile(entity.typeId);
      if (!profile) return;

      const body = new RigidBody(entity, profile);
      const velocity = entity.getVelocity();
      
      // 간단한 경사면 감지
      const isOnSlope = this.detectSlope(entity);
      
      if (isOnSlope) {
        // 경사면 물리 적용
        velocity.x += 0.02;
        velocity.z += 0.02;
        entity.applyImpulse({ x: velocity.x * 0.1, y: 0, z: velocity.z * 0.1 });
        
        // 상태 업데이트
        entity.setDynamicProperty("phys:issliding", true);
        entity.setDynamicProperty("phys:slopeangle", 15.0);
      } else {
        // 일반 중력
        ForceManager.applyGravity(body);
        entity.setDynamicProperty("phys:issliding", false);
      }
      
      // 디버그 정보
      entity.setDynamicProperty("phys:velx", velocity.x.toFixed(2));
      entity.setDynamicProperty("phys:vely", velocity.y.toFixed(2));
      entity.setDynamicProperty("phys:velz", velocity.z.toFixed(2));
      
    } catch (error) {
      console.warn("분산 물리 처리 오류:", error);
    }
  }

  private static detectSlope(entity: Entity): boolean {
    try {
      const pos = entity.location;
      const overworld = world.getDimension("overworld");
      
      // 앞/뒤 블록 높이 차이 확인
      const frontBlock = overworld.getBlock({ x: pos.x + 1, y: pos.y - 1, z: pos.z });
      const backBlock = overworld.getBlock({ x: pos.x - 1, y: pos.y - 1, z: pos.z });
      
      if (frontBlock?.typeId?.includes('stairs') || frontBlock?.typeId?.includes('slab')) {
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }
}
