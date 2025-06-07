// src/physics/core/ForceManager.ts
import { RigidBody } from "./RigidBody";
import { Entity } from "@minecraft/server";

export class ForceManager {
  // 중력 적용 (반드시 static으로 선언)
  static applyGravity(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.y -= 0.08 * body.profile.gravityMultiplier;
    body.setVelocity(velocity);
  }

  // 공기 저항 적용
  static applyAirResistance(body: RigidBody) {
    const velocity = body.getVelocity();
    velocity.x *= body.profile.airResistance;
    velocity.y *= body.profile.airResistance;
    velocity.z *= body.profile.airResistance;
    body.setVelocity(velocity);
  }

  // 바닥 충돌 처리
  static handleGroundCollision(body: RigidBody) {
    const loc = body.entity.location;
    const groundPos = Math.floor(loc.y - 0.5) + 0.5;
    body.entity.teleport(
      { x: loc.x, y: groundPos, z: loc.z },
      { dimension: body.entity.dimension }
    );
  }
}
