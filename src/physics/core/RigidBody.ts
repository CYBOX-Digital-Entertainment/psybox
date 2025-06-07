import { Entity } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

export class RigidBody {
  constructor(
    public entity: Entity,
    public profile: PhysicsProfile
  ) {}

  getVelocity() {
    return this.entity.getVelocity();
  }

  setVelocity(velocity: { x: number, y: number, z: number }) {
    const current = this.entity.getVelocity();
    const impulse = {
      x: velocity.x - current.x,
      y: velocity.y - current.y,
      z: velocity.z - current.z
    };
    this.entity.applyImpulse(impulse);
  }
}
