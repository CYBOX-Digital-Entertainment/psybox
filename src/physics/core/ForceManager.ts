import { RigidBody } from "./RigidBody";
import { Vector3 } from "@minecraft/server";

/**
 * 경사면(계단/반블록 포함)에서의 힘 적용
 */
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
    const velocity = body.getVelocity();
    if (Math.abs(velocity.y) > 0.01) {
      velocity.y *= -body.profile.bounceFactor;
      body.setVelocity(velocity);
    } else {
      body.setVelocity({ x: 0, y: 0, z: 0 });
    }
    const loc = body.entity.location;
    const groundPos = Math.floor(loc.y - 0.5) + 0.5;
    body.entity.teleport(
      { x: loc.x, y: groundPos + 0.01, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }

  static applySlopePhysics(body: RigidBody, slope: { angle: number, direction: Vector3 }) {
    const GRAVITY = 0.08;
    const FRICTION = 0.1; // 계단/반블록 마찰력
    const velocity = body.getVelocity();
    const slopeForce = GRAVITY * Math.sin(slope.angle) * (1 - FRICTION);
    velocity.x += slope.direction.x * slopeForce;
    velocity.z += slope.direction.z * slopeForce;
    velocity.y -= GRAVITY * 0.9 * Math.cos(slope.angle); // Y축 중력 보정
    body.setVelocity(velocity);
  }
}
