import { Entity, Vector3 } from "@minecraft/server";
import { RigidBody } from "../core/RigidBody";
import { SlopeInfo } from "./SlopeDetector";

/**
 * MajestikButter Physics-Test 스타일 힘 적용 시스템
 * 부드럽고 자연스러운 물리 반응 구현
 */
export class ForceApplicator {
  private static readonly GRAVITY_FORCE = 0.08;
  private static readonly SLOPE_MULTIPLIER = 3.0;
  private static readonly DAMPENING_FACTOR = 0.95;

  static applySlopePhysics(body: RigidBody, slopeInfo: SlopeInfo): void {
    const velocity = body.getVelocity();
    const profile = body.profile;

    // MACHINE_BUILDER 스타일 경사면 힘 계산
    const slopeForce = this.GRAVITY_FORCE * Math.sin(slopeInfo.angle) * this.SLOPE_MULTIPLIER;
    const frictionForce = slopeForce * profile.frictionCoefficient;
    const netForce = slopeForce - frictionForce;

    // 경사 방향으로 힘 적용
    velocity.x += slopeInfo.direction.x * netForce * profile.slopeForce;
    velocity.z += slopeInfo.direction.z * netForce * profile.slopeForce;

    // 수직 중력 보정 (경사면에서는 감소)
    velocity.y -= this.GRAVITY_FORCE * Math.cos(slopeInfo.angle) * profile.gravityMultiplier * 0.8;

    // MajestikButter 스타일 부드러운 감쇠
    velocity.x *= this.DAMPENING_FACTOR;
    velocity.z *= this.DAMPENING_FACTOR;

    // 최대 속도 제한
    this.limitVelocity(velocity, profile.maxVelocity);

    // 속도 적용
    body.setVelocity(velocity);

    // 디버그 정보
    if (Math.random() < 0.01) { // 1% 확률로 로그
      console.log(`🏔️ Slope Physics: angle=${(slopeInfo.angle * 180 / Math.PI).toFixed(1)}°, force=${netForce.toFixed(3)}`);
    }
  }

  static applyGravity(body: RigidBody): void {
    const velocity = body.getVelocity();
    velocity.y -= this.GRAVITY_FORCE * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  static applyAirResistance(body: RigidBody): void {
    const velocity = body.getVelocity();
    const resistance = body.profile.airResistance;

    velocity.x *= resistance;
    velocity.y *= resistance;
    velocity.z *= resistance;

    body.setVelocity(velocity);
  }

  static handleCollision(body: RigidBody): void {
    const velocity = body.getVelocity();

    if (Math.abs(velocity.y) > 0.02) {
      // 반발 효과
      velocity.y *= -body.profile.bounceFactor;
      body.setVelocity(velocity);
    } else {
      // 완전 정지
      velocity.y = 0;
      body.setVelocity(velocity);
    }

    // 지면에 정확히 배치
    const loc = body.entity.location;
    const groundY = Math.floor(loc.y - 0.5) + 0.5;

    try {
      body.entity.teleport(
        { x: loc.x, y: groundY + 0.01, z: loc.z },
        { dimension: body.entity.dimension }
      );
    } catch (error) {
      // 텔레포트 실패 무시
    }
  }

  private static limitVelocity(velocity: Vector3, maxVelocity: Vector3): void {
    velocity.x = Math.max(-maxVelocity.x, Math.min(velocity.x, maxVelocity.x));
    velocity.y = Math.max(-maxVelocity.y, Math.min(velocity.y, maxVelocity.y));
    velocity.z = Math.max(-maxVelocity.z, Math.min(velocity.z, maxVelocity.z));
  }

  static applyCustomForce(body: RigidBody, force: Vector3): void {
    const velocity = body.getVelocity();

    velocity.x += force.x / body.profile.mass;
    velocity.y += force.y / body.profile.mass;
    velocity.z += force.z / body.profile.mass;

    this.limitVelocity(velocity, body.profile.maxVelocity);
    body.setVelocity(velocity);
  }
}