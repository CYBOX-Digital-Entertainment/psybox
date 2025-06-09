export class ForceManager {
    static applyGravity(body) {
        try {
            const velocity = body.getVelocity();
            velocity.y -= 0.08 * body.profile.gravityMultiplier;
            body.setVelocity(velocity);
        }
        catch (error) {
            // 중력 적용 실패 무시
        }
    }
    static applyAirResistance(body) {
        try {
            const velocity = body.getVelocity();
            const resistance = body.profile.airResistance;
            velocity.x *= resistance;
            velocity.y *= resistance;
            velocity.z *= resistance;
            body.setVelocity(velocity);
        }
        catch (error) {
            // 공기저항 적용 실패 무시
        }
    }
    static applySlopePhysics(body, slope) {
        try {
            if (slope.strength < 0.01)
                return;
            const GRAVITY = 0.08;
            const velocity = body.getVelocity();
            const slopeForce = GRAVITY * slope.strength * 2.0;
            velocity.x += slope.direction.x * slopeForce;
            velocity.z += slope.direction.z * slopeForce;
            velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.8;
            // 최대 속도 제한
            const maxVel = body.profile.maxVelocity;
            velocity.x = Math.max(-maxVel.x, Math.min(velocity.x, maxVel.x));
            velocity.z = Math.max(-maxVel.z, Math.min(velocity.z, maxVel.z));
            body.setVelocity(velocity);
            // 프로퍼티 업데이트
            body.entity.setDynamicProperty("phys:issliding", slope.strength > 0.1);
            body.entity.setDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
        }
        catch (error) {
            // 경사면 물리 적용 실패 무시
        }
    }
    static handleGroundCollision(body) {
        try {
            const velocity = body.getVelocity();
            if (Math.abs(velocity.y) > 0.02) {
                velocity.y *= -body.profile.bounceFactor;
                body.setVelocity(velocity);
            }
            else {
                velocity.y = 0;
                body.setVelocity(velocity);
            }
            const loc = body.entity.location;
            const groundY = Math.floor(loc.y - 0.5) + 0.5;
            body.entity.teleport({ x: loc.x, y: groundY + 0.01, z: loc.z }, { dimension: body.entity.dimension });
        }
        catch (error) {
            // 충돌 처리 실패 무시
        }
    }
}
