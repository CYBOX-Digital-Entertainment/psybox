import { system, world, Entity, Vector3 } from "@minecraft/server";
import { SteeringSystem } from "./SteeringSystem";

export class VehiclePhysics {
    private readonly overworld = world.getDimension("overworld");
    private steering = new SteeringSystem();

    constructor() {
        system.runInterval(() => this.updatePhysics());
    }

    private updatePhysics() {
        for (const entity of this.overworld.getEntities({ type: "car:basic" })) {
            if (entity.isValid) {
                this.applyVehiclePhysics(entity);
                this.steering.update(entity); // 정상 호출
            }
        }
    }

    private applyVehiclePhysics(entity: Entity) {
        // 기존 물리 계산 로직
    }
}

new VehiclePhysics();
