import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
import { PhysicsState } from "../../components/PhysicsState";

system.runInterval(() => {
  const overworld = world.getDimension("overworld");
  for (const entity of overworld.getEntities()) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (!profile) continue;

    const body = new RigidBody(entity, profile);
    ForceManager.applyGravity(body);
    ForceManager.applyAirResistance(body);

    if (BlockCollision.checkGroundCollision(entity)) {
      ForceManager.handleGroundCollision(body);
    }

    PhysicsState.update(entity);
  }
}, 1);
