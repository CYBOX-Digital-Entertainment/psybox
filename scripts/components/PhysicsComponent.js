export class PhysicsComponent {
    static registerEntity(identifier, config) {
        this.registry.set(identifier, {
            mass: config.mass ?? 1.0,
            gravityMultiplier: config.gravityMultiplier ?? 1.0,
            bounceFactor: config.bounceFactor ?? 0.5,
            airResistance: config.airResistance ?? 0.98,
            maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 }
        });
    }
    static getProfile(entityId) {
        return this.registry.get(entityId);
    }
}
PhysicsComponent.registry = new Map();
