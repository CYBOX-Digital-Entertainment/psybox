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
            // 속도 설정 실패 시 무시
        }
    }
    getLocation() {
        return this.entity.location;
    }
    teleport(location) {
        try {
            this.entity.teleport(location, { dimension: this.entity.dimension });
        }
        catch (error) {
            // 텔레포트 실패 시 무시
        }
    }
    setDynamicProperty(property, value) {
        try {
            this.entity.setDynamicProperty(property, value);
        }
        catch (error) {
            // 프로퍼티 설정 실패 시 무시
        }
    }
    getDynamicProperty(property) {
        try {
            return this.entity.getDynamicProperty(property);
        }
        catch (error) {
            return undefined;
        }
    }
    // isDead 속성 제거, isValid()만 사용
    isValid() {
        try {
            return this.entity.isValid();
        }
        catch (error) {
            return false;
        }
    }
}
