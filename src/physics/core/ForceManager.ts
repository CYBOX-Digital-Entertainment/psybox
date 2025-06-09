import { RigidBody } from "./RigidBody";
import { Vector3 } from "@minecraft/server";

export class ForceManager {
  static applyGravity(body: RigidBody) {
    try {
      const velocity = body.getVelocity();
      velocity.y -= 0.08 * body.profile.gravityMultiplier;
      body.setVelocity(velocity);
    } catch (error) {
      // 중력 적용 실패 시 무시
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
      // 공기저항 적용 실패 시 무시
    }
  }

  static applySlopePhysics(body: RigidBody, slope: { angle: number, direction: Vector3, strength: number }) {
    if (slope.strength < 0.01) return;

    try {
      const GRAVITY = 0.08;
      const velocity = body.getVelocity();
      const dir = this.normalizeVector(slope.direction);

      // 경사면 힘 계산
      const slopeForce = body.profile.slopeForce * slope.strength * 2.0;
      velocity.x += dir.x * slopeForce;
      velocity.z += dir.z * slopeForce;

      // Y축 중력 보정
      velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.8;

      // 속도 제한
      const maxVel = body.profile.maxVelocity;
      velocity.x = Math.max(-maxVel.x, Math.min(velocity.x, maxVel.x));
      velocity.z = Math.max(-maxVel.z, Math.min(velocity.z, maxVel.z));

      body.setVelocity(velocity);

      // 프로퍼티 업데이트
      body.setDynamicProperty("phys:issliding", slope.strength > 0.05);
      body.setDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
      body.setDynamicProperty("phys:slopestrength", slope.strength);

    } catch (error) {
      // 경사면 물리 적용 실패 시 무시
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

      const loc = body.getLocation();
      const groundY = Math.floor(loc.y - 0.5) + 0.5;
      body.teleport({ x: loc.x, y: groundY + 0.01, z: loc.z });

    } catch (error) {
      // 충돌 처리 실패 시 무시
    }
  }

  private static normalizeVector(v: Vector3): Vector3 {
    const length = Math.sqrt(v.x**2 + v.y**2 + v.z**2);
    return length > 0 ? { x: v.x/length, y: v.y/length, z: v.z/length } : { x: 0, y: 0, z: 0 };
  }
}
