import { RigidBody } from "./RigidBody";
import { Vector3 } from "@minecraft/server";

/**
 * MajestikButter Physics-Test 스타일의 부드러운 물리 계산
 */
export class ForceManager {
  static applyGravity(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y -= 0.08 * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  static applyAirResistance(body: RigidBody) {
    const velocity = body.getVelocity();
    const resistance = body.profile.airResistance;
    
    velocity.x *= resistance;
    velocity.y *= resistance;
    velocity.z *= resistance;
    
    body.setVelocity(velocity);
  }

  static applySlopePhysics(body: RigidBody, slope: { angle: number, direction: Vector3, strength: number }) {
    if (slope.strength < 0.05) return; // 경사가 너무 완만하면 무시
    
    const GRAVITY = 0.08;
    const FRICTION = 0.15; // 마찰 계수
    const velocity = body.getVelocity();
    
    // MajestikButter 스타일의 부드러운 가속도 계산
    const slopeForce = GRAVITY * Math.sin(slope.angle) * (1 - FRICTION);
    const dampening = 0.95; // 부드러운 움직임을 위한 감쇠
    
    // 경사 방향으로 힘 적용
    velocity.x += slope.direction.x * slopeForce * dampening;
    velocity.z += slope.direction.z * slopeForce * dampening;
    
    // Y축 중력 보정 (경사면에서는 수직 중력 감소)
    velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.8;
    
    // 최대 속도 제한
    const maxVel = body.profile.maxVelocity;
    velocity.x = Math.max(-maxVel.x, Math.min(velocity.x, maxVel.x));
    velocity.z = Math.max(-maxVel.z, Math.min(velocity.z, maxVel.z));
    
    body.setVelocity(velocity);
    
    // 프로퍼티 업데이트
    body.entity.setDynamicProperty("phys:issliding", slope.strength > 0.1);
    body.entity.setDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
  }

  static handleGroundCollision(body: RigidBody) {
    const velocity = body.getVelocity();
    
    if (Math.abs(velocity.y) > 0.02) {
      // 바운스 효과
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
    body.entity.teleport(
      { x: loc.x, y: groundY + 0.01, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }
}
