import { RigidBody } from "./RigidBody";
import { Vector3 } from "@minecraft/server";

export class ForceManager {
  static applyGravity(body: RigidBody) {
    try {
      const velocity = body.getVelocity();
      velocity.y -= 0.08 * body.profile.gravityMultiplier;
      body.setVelocity(velocity);
    } catch (error) {
      // 중력 적용 실패 무시
    }
  }

  static applyAirResistance(body: RigidBody) {
    try {
      const velocity = body.getVelocity();
      const resistance = body.profile.airResistance;

      velocity.x *= resistance;
      velocity.y *= resistance;
      velocity.z *= resistance;

      body.setVelocity(velocity);
    } catch (error) {
      // 공기저항 적용 실패 무시
    }
  }

  static applySlopePhysics(body: RigidBody, slope: { angle: number, direction: Vector3, strength: number }) {
    if (slope.strength < 0.01) return;

    try {
      const GRAVITY = 0.08;
      const FRICTION = 0.05;
      const velocity = body.getVelocity();

      const slopeForce = GRAVITY * slope.strength * 3.0;
      const dampening = 0.98;

      velocity.x += slope.direction.x * slopeForce * dampening;
      velocity.z += slope.direction.z * slopeForce * dampening;
      velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.9;

      const maxVel = body.profile.maxVelocity;
      velocity.x = Math.max(-maxVel.x, Math.min(velocity.x, maxVel.x));
      velocity.z = Math.max(-maxVel.z, Math.min(velocity.z, maxVel.z));

      body.setVelocity(velocity);

      body.setDynamicProperty("phys:issliding", slope.strength > 0.05);
      body.setDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
      body.setDynamicProperty("phys:slopestrength", slope.strength);

    } catch (error) {
      // 경사면 물리 적용 실패 무시
    }
  }

  static handleGroundCollision(body: RigidBody) {
    try {
      const velocity = body.getVelocity();

      if (Math.abs(velocity.y) > 0.02) {
        velocity.y *= -body.profile.bounceFactor;
        body.setVelocity(velocity);
      } else {
        velocity.y = 0;
        body.setVelocity(velocity);
      }

      const loc = body.entity.location;
      const groundY = Math.floor(loc.y - 0.5) + 0.5;
      body.entity.teleport(
        { x: loc.x, y: groundY + 0.01, z: loc.z },
        { dimension: body.entity.dimension }
      );
    } catch (error) {
      // 충돌 처리 실패 무시
    }
  }
}
