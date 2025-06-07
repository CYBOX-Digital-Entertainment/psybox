export class RigidBody {
    constructor(entity, profile) {
        this.entity = entity;
        this.profile = profile;
    }
    getVelocity() {
        return this.entity.getVelocity();
    }
    setVelocity(velocity) {
        const current = this.entity.getVelocity();
        const impulse = {
            x: velocity.x - current.x,
            y: velocity.y - current.y,
            z: velocity.z - current.z
        };
        this.entity.applyImpulse(impulse);
    }
}
