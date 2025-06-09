/**
 * Script API 2.0.0-beta 호환 물리 컴포넌트 시스템
 */
export class PhysicsComponent {
    static registerEntity(identifier, config) {
        const profile = {
            mass: config.mass ?? 1.0,
            gravityMultiplier: config.gravityMultiplier ?? 1.0,
            bounceFactor: config.bounceFactor ?? 0.5,
            airResistance: config.airResistance ?? 0.98,
            maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 },
            slopeForce: config.slopeForce ?? 0.1,
            frictionCoefficient: config.frictionCoefficient ?? 0.15
        };
        this.registry.set(identifier, profile);
        console.log(`🔧 물리 프로파일 등록: ${identifier}`);
        this.isInitialized = true;
    }
    static getProfile(entityId) {
        return this.registry.get(entityId);
    }
    static getAllProfiles() {
        return new Map(this.registry);
    }
    static isSystemInitialized() {
        return this.isInitialized;
    }
    static getProfileCount() {
        return this.registry.size;
    }
}
PhysicsComponent.registry = new Map();
PhysicsComponent.isInitialized = false;
