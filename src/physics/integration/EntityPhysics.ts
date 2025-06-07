import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
import { SlopeDetector } from "./SlopeDetector";

/**
 * 1틱마다 실행되는 물리 시뮬레이션 메인 루프
 */
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (!profile) continue;
    
    const body = new RigidBody(entity, profile);
    const isGrounded = BlockCollision.checkGroundCollision(entity);
    const slope = SlopeDetector.getSlopeInfo(entity);
    
    // 경사면 물리 우선 적용
    if (slope.strength > 0.1 && isGrounded) {
      ForceManager.applySlopePhysics(body, slope);
    } else {
      // 일반 중력과 공기저항
      ForceManager.applyGravity(body);
      ForceManager.applyAirResistance(body);
    }
    
    // 지면 충돌 처리
    if (isGrounded && entity.getVelocity().y <= 0) {
      ForceManager.handleGroundCollision(body);
    }
    
    // 프로퍼티 동기화
    const vel = entity.getVelocity();
    entity.setDynamicProperty("phys:velx", vel.x.toFixed(3));
    entity.setDynamicProperty("phys:vely", vel.y.toFixed(3));
    entity.setDynamicProperty("phys:velz", vel.z.toFixed(3));
    entity.setDynamicProperty("phys:isgrounded", isGrounded);
  }
}, 1); // 1틱마다 실행 (20Hz)
