import { RigidBody } from "./RigidBody";

// 두 강체의 충돌을 해결하는 기본 구조
export class CollisionSolver {
  static resolveCollision(bodyA: RigidBody, bodyB: RigidBody) {
    // (여기서는 간단히 반발력만 적용)
    // 실제 구현에서는 위치, 속도, 질량 등 다양한 요소를 고려해야 함
    const vA = bodyA.getVelocity();
    const vB = bodyB.getVelocity();

    // 반발력 적용 예시
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
