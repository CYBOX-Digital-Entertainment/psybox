import { system, world, Entity } from "@minecraft/server";

export class SteeringSystem {
    private static readonly MAX_STEERING_ANGLE = 30;

    public update(entity: Entity) { // public으로 변경 및 매개변수 추가
        const currentAngle = this.calculateSteeringAngle(entity);
        entity.setDynamicProperty("steering_angle", currentAngle);
    }

    private calculateSteeringAngle(entity: Entity): number {
        const input = this.getSteeringInput(entity);
        return Math.min(Math.max(input * SteeringSystem.MAX_STEERING_ANGLE, -30), 30);
    }

    private getSteeringInput(entity: Entity): number {
        return 0.5; // 임시 값
    }
}
