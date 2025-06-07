// src/physics/RigidBody.ts
export class RigidBody {
  private velocity: Vector3;
  
  constructor(public mass: number) {
    this.velocity = { x:0, y:0, z:0 };
  }

  applyForce(force: Vector3) {
    // F=ma 계산 구현
  }
}
