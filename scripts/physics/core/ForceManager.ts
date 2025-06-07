import { RigidBody } from "./RigidBody";

// 중력, 가속도 등 힘을 적용하는 유틸리티
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
}
