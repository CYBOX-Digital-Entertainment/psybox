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
      // 속도 설정 실패 무시
    }
  }

  getDynamicProperty(property: string): number | boolean | string | undefined {
    try {
      const value = this.entity.getDynamicProperty(property);
      // Vector3 타입 제외하고 반환
      if (typeof value === 'object' && value !== null && 'x' in value) {
        return undefined;
      }
      return value as number | boolean | string | undefined;
    } catch (error) {
      return undefined;
    }
  }

  setDynamicProperty(property: string, value: number | boolean | string) {
    try {
      this.entity.setDynamicProperty(property, value);
    } catch (error) {
      // 프로퍼티 설정 실패 무시
    }
  }

  isValid(): boolean {
    try {
      // Script API 2.0.0-beta에서 isValid는 속성입니다
      return this.entity.isValid;
    } catch (error) {
      return false;
    }
  }
}
