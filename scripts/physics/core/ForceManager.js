// 중력, 공기저항, 바닥 충돌 등 힘을 적용
export class ForceManager {
    static applyPhysics(body) {
        this.applyGravity(body);
        this.applyAirResistance(body);
    }
    static applyGravity(body) {
        const velocity = body.getVelocity();
        velocity.y -= 0.08 * body.profile.gravityMultiplier;
        body.setVelocity(velocity);
    }
    static applyAirResistance(body) {
        const velocity = body.getVelocity();
        velocity.x *= body.profile.airResistance;
        velocity.y *= body.profile.airResistance;
        velocity.z *= body.profile.airResistance;
        body.setVelocity(velocity);
    }
    static handleGroundCollision(body) {
        const loc = body.entity.location;
        const groundPos = Math.floor(loc.y - 0.5) + 0.5;
        body.entity.teleport({ x: loc.x, y: groundPos, z: loc.z }, { dimension: body.entity.dimension });
    }
}
