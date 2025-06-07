import { RigidBody } from "./RigidBody";

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
