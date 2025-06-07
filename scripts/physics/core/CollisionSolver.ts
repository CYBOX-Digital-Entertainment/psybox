import { RigidBody } from "./RigidBody";

export class CollisionSolver {
  static resolveCollision(bodyA: RigidBody, bodyB: RigidBody) {
    const vA = bodyA.getVelocity();
    const vB = bodyB.getVelocity();

    // 튕김 효과 적용 (단순 예시)
    vA.x *= -bodyA.profile.bounceFactor;
    vA.y *= -bodyA.profile.bounceFactor;
    vA.z *= -bodyA.profile.bounceFactor;

    vB.x *= -bodyB.profile.bounceFactor;
    vB.y *= -bodyB.profile.bounceFactor;
    vB.z *= -bodyB.profile.bounceFactor;

    bodyA.setVelocity(vA);
    bodyB.setVelocity(vB);
  }
}
