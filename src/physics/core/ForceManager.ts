import { RigidBody } from "./RigidBody";
import { Vector3 } from "@minecraft/server";

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
    if (slope.strength < 0.01) return; // 임계값 낮춤
    
    const GRAVITY = 0.08;
    const FRICTION = 0.05; // 마찰 감소로 더 잘 미끄러지게
    const velocity = body.getVelocity();
    
    // 더 강력한 경사면 힘 계산
    const slopeForce = GRAVITY * slope.strength * 3.0; // 힘 증폭
    const dampening = 0.98; // 감쇠 감소
    
    // 방향별 힘 적용
    velocity.x += slope.direction.x * slopeForce * dampening;
    velocity.z += slope.direction.z * slopeForce * dampening;
    
    // Y축 중력 보정
    velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.9;
    
    // 속도 제한
    const maxVel = body.profile.maxVelocity;
    velocity.x = Math.max(-maxVel.x, Math.min(velocity.x, maxVel.x));
    velocity.z = Math.max(-maxVel.z, Math.min(velocity.z, maxVel.z));
    
    body.setVelocity(velocity);
    
    // 디버깅을 위한 콘솔 출력
    console.log(`경사 적용: 각도=${slope.angle.toFixed(2)}, 강도=${slope.strength.toFixed(2)}, 힘=${slopeForce.toFixed(2)}`);
    
    // 프로퍼티 업데이트
    body.entity.setDynamicProperty("phys:issliding", slope.strength > 0.05);
    body.entity.setDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
  }

  static handleGroundCollision(body: RigidBody) {
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
  }
}
