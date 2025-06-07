import { RigidBody } from "./RigidBody";
import { Entity } from "@minecraft/server";

// 중력, 공기저항, 바닥 충돌 등 힘을 적용
export class ForceManager {
  static applyGravity(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y -= 0.08 * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  static applyAirResistance(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y *= body.profile.airResistance; // Y축만 공기저항 적용
    body.setVelocity(velocity);
  }

  static handleGroundCollision(body: RigidBody) {
    const velocity = body.getVelocity();
    // 반발력 적용, 0.01 이상일 때만 튕김
    if (Math.abs(velocity.y) > 0.01) {
      velocity.y *= -body.profile.bounceFactor;
      body.setVelocity(velocity);
    } else {
      // 아주 느린 경우 멈추게 처리
      body.setVelocity({ x: 0, y: 0, z: 0 });
    }
    // 위치 보정 (살짝 위로)
    const loc = body.entity.location;
    const groundPos = Math.floor(loc.y - 0.5) + 0.5;
    (body.entity as Entity).teleport(
      { x: loc.x, y: groundPos + 0.01, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }
}

