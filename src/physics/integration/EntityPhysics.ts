// src/physics/integration/EntityPhysics.ts
import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities({ type: "cybox:spirra" })) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (!profile) continue;

    const body = new RigidBody(entity, profile);
    ForceManager.applyGravity(body);
    ForceManager.applyAirResistance(body);

    // 동적 속성 동기화 (클라이언트로 전송)
    entity.setDynamicProperty("phys:velX", body.getVelocity().x);
    entity.setDynamicProperty("phys:velY", body.getVelocity().y);
    entity.setDynamicProperty("phys:velZ", body.getVelocity().z);
  }
}, 1);
