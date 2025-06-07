import { Entity } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

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
