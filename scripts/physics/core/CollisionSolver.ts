// physics/core/CollisionSolver.ts
import { GJK, EPA } from 'sopiro-physics-module';

class HybridCollisionSolver {
  solve(bodyA: RigidBody, bodyB: RigidBody) {
    const simplex = GJK.detectCollision(bodyA, bodyB);
    if (simplex) {
      return EPA.resolveCollision(simplex);
    }
    return null;
  }
}
