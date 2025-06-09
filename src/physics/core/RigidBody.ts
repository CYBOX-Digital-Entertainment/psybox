import { Entity } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

export class RigidBody {
  constructor(
    public entity: Entity,
    public profile: PhysicsProfile
  ) {}

  getVelocity() {
    try {
      return this.entity.getVelocity();
    } catch (error) {
      return { x: 0, y: 0, z: 0 };
    }
  }

  setVelocity(velocity: { x: number, y: number, z: number }) {
    try {
      const current = this.entity.getVelocity();
      const impulse = {
        x: velocity.x - current.x,
        y: velocity.y - current.y,
        z: velocity.z - current.z
      };
      this.entity.applyImpulse(impulse);
    } catch (error) {
      // 속도 설정 실패 시 무시
    }
  }

  getLocation() {
    return this.entity.location;
  }

  teleport(location: { x: number, y: number, z: number }) {
    try {
      this.entity.teleport(location, { dimension: this.entity.dimension });
    } catch (error) {
      // 텔레포트 실패 시 무시
    }
  }

  setDynamicProperty(property: string, value: string | number | boolean) {
    try {
      this.entity.setDynamicProperty(property, value);
    } catch (error) {
      // 프로퍼티 설정 실패 시 무시
    }
  }

  getDynamicProperty(property: string): string | number | boolean | undefined {
    try {
      return this.entity.getDynamicProperty(property);
    } catch (error) {
      return undefined;
    }
  }

  // isDead 속성 제거, isValid()만 사용
  isValid(): boolean {
    try {
      return this.entity.isValid();
    } catch (error) {
      return false;
    }
  }
}
