import { RigidBody } from "./RigidBody";
import { Entity } from "@minecraft/server";

// 중력, 공기저항, 바닥 충돌 등 힘을 적용
export class ForceManager {
  static applyPhysics(body: RigidBody) {
    this.applyGravity(body);
    this.applyAirResistance(body);
  }

  static applyGravity(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y -= 0.08 * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  static applyAirResistance(body: RigidBody) {
  const velocity = body.getVelocity();
  // Y축에만 공기 저항 적용 (실제 물리 현상과 유사하게)
  velocity.y *= body.profile.airResistance;
  body.setVelocity(velocity);
}


  static handleGroundCollision(body: RigidBody) {
  const velocity = body.getVelocity();
  // Y축 반발력 적용 (기존 0으로 초기화하지 않음)
  velocity.y *= -body.profile.bounceFactor;
  body.setVelocity(velocity);

  // 위치 보정
  const loc = body.entity.location;
  const groundPos = Math.floor(loc.y - 0.5) + 0.5;
  body.entity.teleport(
    { x: loc.x, y: groundPos + 0.1, z: loc.z }, // 0.1만큼 위로 보정
    { dimension: body.entity.dimension }
  );
}
}
