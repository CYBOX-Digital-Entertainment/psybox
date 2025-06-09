/**
 * Script API 2.0.0-beta 호환 물리 힘 관리자
 */
export class ForceManager {
    static applyGravity(body) {
        try {
            const velocity = body.getVelocity();
            velocity.y -= 0.08 * body.profile.gravityMultiplier;
            body.setVelocity(velocity);
        }
        catch (error) {
            // 중력 적용 실패는 무시
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
            // 공기저항 적용 실패는 무시
        }
    }
    static applySlopePhysics(body, slope) {
        try {
            if (slope.strength < 0.05)
                return; // 경사가 너무 완만하면 무시
            const GRAVITY = 0.08;
            const velocity = body.getVelocity();
            const friction = body.profile.frictionCoefficient ?? 0.1;
            const slopeForce = (body.profile.slopeForce ?? 0.1) * Math.sin(slope.angle) * (1 - friction);
            // 경사 방향으로 힘 적용 (베타 API 2.0.0 최적화)
            velocity.x += slope.direction.x * slopeForce;
            velocity.z += slope.direction.z * slopeForce;
            velocity.y -= GRAVITY * Math.cos(slope.angle) * 0.8;
            body.setVelocity(velocity);
            // 동적 프로퍼티 업데이트
            body.updateDynamicProperty("phys:issliding", slope.strength > 0.1);
            body.updateDynamicProperty("phys:slopeangle", slope.angle * 180 / Math.PI);
            body.updateDynamicProperty("phys:slopestrength", slope.strength);
        }
        catch (error) {
            console.warn("경사면 물리 적용 오류:", error);
        }
    }
    static handleGroundCollision(body) {
        try {
            const velocity = body.getVelocity();
            if (Math.abs(velocity.y) > 0.02) {
                // 반발 효과
                velocity.y *= -body.profile.bounceFactor;
                body.setVelocity(velocity);
            }
            else {
                // 완전 정지
                velocity.y = 0;
                body.setVelocity(velocity);
            }
            // 지면에 정확히 배치 (베타 API 2.0.0 개선된 텔레포트)
            const loc = body.getLocation();
            const groundY = Math.floor(loc.y - 0.5) + 0.5;
            body.entity.teleport({ x: loc.x, y: groundY + 0.01, z: loc.z }, { dimension: body.entity.dimension });
        }
        catch (error) {
            // 충돌 처리 실패는 무시
        }
    }
    static normalizeVector(v) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return length > 0 ? {
            x: v.x / length,
            y: v.y / length,
            z: v.z / length
        } : { x: 0, y: 0, z: 0 };
    }
}
