export class RigidBody {
    constructor(entity, profile) {
        this.entity = entity;
        this.profile = profile;
    }
    getVelocity() {
        try {
            return this.entity.getVelocity();
        }
        catch (error) {
            return { x: 0, y: 0, z: 0 };
        }
    }
    setVelocity(velocity) {
        try {
            const current = this.entity.getVelocity();
            const impulse = {
                x: velocity.x - current.x,
                y: velocity.y - current.y,
                z: velocity.z - current.z
            };
            this.entity.applyImpulse(impulse);
        }
        catch (error) {
            // 속도 설정 실패 무시
        }
    }
    getDynamicProperty(property) {
        try {
            const value = this.entity.getDynamicProperty(property);
            // Vector3 타입 제외하고 반환
            if (typeof value === 'object' && value !== null && 'x' in value) {
                return undefined;
            }
            return value;
        }
        catch (error) {
            return undefined;
        }
    }
    setDynamicProperty(property, value) {
        try {
            this.entity.setDynamicProperty(property, value);
        }
        catch (error) {
            // 프로퍼티 설정 실패 무시
        }
    }
    isValid() {
        try {
            // Script API 2.0.0-beta에서 isValid는 속성입니다
            return this.entity.isValid;
        }
        catch (error) {
            return false;
        }
    }
}
