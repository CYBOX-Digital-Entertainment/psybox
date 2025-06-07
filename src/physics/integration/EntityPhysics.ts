import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";

let physicsEnabled = true;

system.runInterval(() => {
  if (!physicsEnabled) return;
  
  try {
    const overworld = world.getDimension("overworld");
    const entities = overworld.getEntities({ type: "cybox:spirra" });
    
    for (const entity of entities) {
      try {
        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile) continue;
        
        const body = new RigidBody(entity, profile);
        
        // 기본 물리 적용
        ForceManager.applyGravity(body);
        ForceManager.applyAirResistance(body);
        
        // 지면 충돌 간단 체크
        const velocity = entity.getVelocity();
        if (velocity.y <= 0 && entity.location.y <= 1) {
          ForceManager.handleGroundCollision(body);
        }
        
      } catch (entityError) {
        // 개별 엔티티 오류 무시
      }
    }
  } catch (systemError) {
    // 시스템 오류 시 물리 일시 중단
    physicsEnabled = false;
    system.runTimeout(() => {
      physicsEnabled = true;
    }, 100);
  }
}, 2); // 2틱마다 실행 (성능 최적화)
