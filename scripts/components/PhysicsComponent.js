export class PhysicsComponent {
    static registerEntity(identifier, config) {
        this.registry.set(identifier, {
            mass: config.mass ?? 1.0,
            gravityMultiplier: config.gravityMultiplier ?? 1.0,
            bounceFactor: config.bounceFactor ?? 0.5,
            airResistance: config.airResistance ?? 0.98,
            maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 }
        });
        console.log(`물리 프로파일 등록: ${identifier}`);
    }
    static getProfile(entityId) {
        return this.registry.get(entityId);
    }
    static getAllProfiles() {
        return new Map(this.registry);
    }
}
PhysicsComponent.registry = new Map();
