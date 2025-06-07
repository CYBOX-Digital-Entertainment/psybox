export class PhysicsComponent {
    static registerEntity(identifier, config) {
        const profile = {
            mass: config.mass ?? 1.0,
            gravityMultiplier: config.gravityMultiplier ?? 1.0,
            bounceFactor: config.bounceFactor ?? 0.5,
            airResistance: config.airResistance ?? 0.98,
            maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 },
            slopeForce: config.slopeForce ?? 0.1,
            frictionCoefficient: config.frictionCoefficient ?? 0.1
        };
        this.registry.set(identifier, profile);
        console.log(`🔧 Physics Profile Registered: ${identifier}`);
        console.log(`   Mass: ${profile.mass}, Gravity: ${profile.gravityMultiplier}x`);
        console.log(`   Max Velocity: ${JSON.stringify(profile.maxVelocity)}`);
        this.isInitialized = true;
    }
    static getProfile(entityId) {
        return this.registry.get(entityId);
    }
    static getAllProfiles() {
        return new Map(this.registry);
    }
    static isProfileRegistered(entityId) {
        return this.registry.has(entityId);
    }
    static getRegisteredCount() {
        return this.registry.size;
    }
    static isSystemInitialized() {
        return this.isInitialized;
    }
}
PhysicsComponent.registry = new Map();
PhysicsComponent.isInitialized = false;
