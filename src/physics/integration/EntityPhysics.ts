// src/physics/integration/EntityPhysics.ts
import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
import { PhysicsState } from "../../components/PhysicsState";

// 1틱(0.05초) 주기 물리 업데이트
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities()) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (!profile) continue;

    // 물리 계산
    const body = new RigidBody(entity, profile);
    ForceManager.applyGravity(body);
    ForceManager.applyAirResistance(body);
    
    // 충돌 처리
    if (BlockCollision.checkGroundCollision(entity)) {
      ForceManager.handleGroundCollision(body);
    }
    
    // 애니메이션용 상태 업데이트
    PhysicsState.update(entity);
  }
}, 1);
