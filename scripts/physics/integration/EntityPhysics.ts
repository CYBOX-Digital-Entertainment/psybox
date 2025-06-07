import { world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";

world.events.tick.subscribe(() => {
  for (const entity of world.getDimension("overworld").getEntities()) {
    const profile = PhysicsComponent.getProfile(entity.typeId);
    if (profile) {
      const body = new RigidBody(entity, profile);
      ForceManager.applyGravity(body);
      ForceManager.applyAirResistance(body);
    }
  }
});
