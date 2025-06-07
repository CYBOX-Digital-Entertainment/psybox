import { RigidBody } from "./RigidBody";

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

  static applySlopePhysics(body: RigidBody, angle: number) {
  const slopeForce = 0.08 * Math.sin(angle) * body.profile.mass;
  body.setVelocity({ 
    x: body.getVelocity().x + slopeForce,
    y: body.getVelocity().y,
    z: body.getVelocity().z
  });
}

  static handleGroundCollision(body: RigidBody) {
    const loc = body.entity.location;
    const groundPos = Math.floor(loc.y - 0.5) + 0.5;
    body.entity.teleport(
      { x: loc.x, y: groundPos + 0.01, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }
}
