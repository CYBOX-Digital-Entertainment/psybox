import { Entity } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

// 엔티티의 물리 상태(속도, 가속도 등)를 관리하는 클래스
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
    this.entity.setVelocity(velocity);
  }
}
