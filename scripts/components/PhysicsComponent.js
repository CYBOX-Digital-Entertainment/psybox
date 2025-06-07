export class PhysicsComponent {
    // 엔티티 식별자별로 물리 프로파일 등록
    static registerEntity(identifier, config) {
        this.registry.set(identifier, {
            mass: config.mass ?? 1.0,
            gravityMultiplier: config.gravityMultiplier ?? 1.0,
            bounceFactor: config.bounceFactor ?? 0.5,
            airResistance: config.airResistance ?? 0.98,
            maxVelocity: config.maxVelocity ?? { x: 3, y: 3, z: 3 }
        });
    }
    // 엔티티 식별자로 물리 프로파일 조회
    static getProfile(entityId) {
        return this.registry.get(entityId);
    }
}
PhysicsComponent.registry = new Map();
