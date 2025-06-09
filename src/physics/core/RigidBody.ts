import { Entity, Vector3 } from "@minecraft/server";
import { PhysicsProfile } from "../../components/PhysicsComponent";

/**
 * Script API 2.0.0-beta 호환 강체 물리 클래스
 */
export class RigidBody {
  constructor(
    public entity: Entity,
    public profile: PhysicsProfile
  ) {}

  getVelocity(): Vector3 {
    try {
      return this.entity.getVelocity();
    } catch (error) {
      return { x: 0, y: 0, z: 0 };
    }
  }

  setVelocity(velocity: Vector3): void {
    try {
      // Script API 2.0.0-beta - 더 안전한 속도 설정
      const current = this.entity.getVelocity();
      const impulse: Vector3 = {
        x: velocity.x - current.x,
        y: velocity.y - current.y,
        z: velocity.z - current.z
      };

      // 최대 속도 제한 적용
      const maxVel = this.profile.maxVelocity;
      impulse.x = Math.max(-maxVel.x, Math.min(impulse.x, maxVel.x));
      impulse.y = Math.max(-maxVel.y, Math.min(impulse.y, maxVel.y));
      impulse.z = Math.max(-maxVel.z, Math.min(impulse.z, maxVel.z));

      this.entity.applyImpulse(impulse);
    } catch (error) {
      // 속도 설정 실패는 조용히 무시
    }
  }

  getLocation(): Vector3 {
    try {
      return this.entity.location;
    } catch (error) {
      return { x: 0, y: 0, z: 0 };
    }
  }

  getRotation(): { x: number, y: number } {
    try {
      return this.entity.getRotation();
    } catch (error) {
      return { x: 0, y: 0 };
    }
  }

  isValid(): boolean {
    try {
      return this.entity.isValid() && !this.entity.isDead;
    } catch (error) {
      return false;
    }
  }

  updateDynamicProperty(key: string, value: any): void {
    try {
      this.entity.setDynamicProperty(key, value);
    } catch (error) {
      // 동적 프로퍼티 설정 실패는 무시
    }
  }
}
