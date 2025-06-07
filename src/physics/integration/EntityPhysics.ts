import { system, world, Entity } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";

// 1틱(0.05초)마다 물리 업데이트
system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities()) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (!profile) continue;

    const body = new RigidBody(entity, profile);
    ForceManager.applyPhysics(body);

    if (BlockCollision.checkGroundCollision(entity)) {
      ForceManager.handleGroundCollision(body); // 기존 setVelocity(0) 제거
    }
  }
}, 1); // 1틱(0.05초) 주기 유지
