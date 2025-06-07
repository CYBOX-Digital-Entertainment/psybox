/**
 * 강체 물리학 구현
 * 엔티티의 물리적 속성과 운동을 관리
 */
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
            // 질량을 고려한 충격량 적용
            const massAdjustedImpulse = {
                x: impulse.x / this.profile.mass,
                y: impulse.y / this.profile.mass,
                z: impulse.z / this.profile.mass
            };
            this.entity.applyImpulse(massAdjustedImpulse);
        }
        catch (error) {
            // 속도 설정 실패 시 무시
        }
    }
    getKineticEnergy() {
        const velocity = this.getVelocity();
        const speedSquared = velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2;
        return 0.5 * this.profile.mass * speedSquared;
    }
    getSpeed() {
        const velocity = this.getVelocity();
        return Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
    }
    getHorizontalSpeed() {
        const velocity = this.getVelocity();
        return Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
    }
    getMomentum() {
        const velocity = this.getVelocity();
        return {
            x: velocity.x * this.profile.mass,
            y: velocity.y * this.profile.mass,
            z: velocity.z * this.profile.mass
        };
    }
    isMoving() {
        return this.getSpeed() > 0.001;
    }
    isAirborne() {
        try {
            const velocity = this.getVelocity();
            return Math.abs(velocity.y) > 0.001;
        }
        catch (error) {
            return false;
        }
    }
    addForce(force) {
        const velocity = this.getVelocity();
        // F = ma, a = F/m
        velocity.x += force.x / this.profile.mass;
        velocity.y += force.y / this.profile.mass;
        velocity.z += force.z / this.profile.mass;
        this.setVelocity(velocity);
    }
    stopMotion() {
        this.setVelocity({ x: 0, y: 0, z: 0 });
    }
    isValid() {
        return this.entity && this.entity.isValid();
    }
}
