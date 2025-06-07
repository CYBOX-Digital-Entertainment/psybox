import { RigidBody } from "./RigidBody";

// 두 강체의 충돌을 단순 처리 (반발력 적용)
export class CollisionSolver {
  static resolveCollision(bodyA: RigidBody, bodyB: RigidBody) {
    const vA = bodyA.getVelocity();
    const vB = bodyB.getVelocity();

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
