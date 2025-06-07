import { Entity } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

// 엔티티의 물리 상태 래퍼
export class RigidBody {
  entity: Entity;
  profile: PhysicsProfile;

  constructor(entity: Entity, profile: PhysicsProfile) {
    this.entity = entity;
    this.profile = profile;
  }

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
