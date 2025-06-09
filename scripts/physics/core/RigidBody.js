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
    // isDead 속성 제거하고 isValid()만 사용
    isValid() {
        try {
            return this.entity.isValid();
        }
        catch (error) {
            return false;
        }
    }
}
