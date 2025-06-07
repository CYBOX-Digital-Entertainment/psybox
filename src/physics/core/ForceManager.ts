import { RigidBody } from "./RigidBody";
import { Entity } from "@minecraft/server";

export class ForceManager {
  static applyGravity(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y -= 0.08 * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  static applyAirResistance(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.x *= body.profile.airResistance;
    velocity.y *= body.profile.airResistance;
    velocity.z *= body.profile.airResistance;
    body.setVelocity(velocity);
  }

  static handleGroundCollision(body: RigidBody) {
    const loc = body.entity.location;
    const groundPos = Math.floor(loc.y - 0.5) + 0.5;
    (body.entity as Entity).teleport(
      { x: loc.x, y: groundPos, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }
}
