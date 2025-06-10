import { world, Player, Entity, system } from "@minecraft/server";

export class InputHandler {
    private static readonly STEERING_SENSITIVITY = 0.1;

    constructor() {
        world.beforeEvents.itemUse.subscribe((event) => {
            if (event.itemStack.typeId === "minecraft:carrot_on_a_stick") {
                this.handleSteeringInput(event.source as Player);
            }
        });
    }

    private handleSteeringInput(player: Player) {
        // 모든 차량 엔티티 순회
        for (const entity of world.getDimension("overworld").getEntities({ type: "car:basic" })) {
            // rideable 컴포넌트 확인
            const rideable = entity.getComponent("minecraft:rideable") as any;
            if (!rideable || !rideable.seatCount) continue;

            // 각 좌석의 탑승자 확인
            for (let seat = 0; seat < rideable.seatCount; seat++) {
                // API에는 공식적으로 seat occupant를 반환하는 메서드가 없으므로,
                // 플레이어의 위치와 차량의 좌석 위치가 충분히 가까우면 탑승 중으로 간주 (근사치)
                const seatPos = rideable.seats?.[seat]?.position;
                if (!seatPos) continue;
                const entityPos = entity.location;
                const playerPos = player.location;
                const dx = Math.abs(entityPos.x + seatPos[0] - playerPos.x);
                const dy = Math.abs(entityPos.y + seatPos[1] - playerPos.y);
                const dz = Math.abs(entityPos.z + seatPos[2] - playerPos.z);
                if (dx < 1 && dy < 1 && dz < 1) {
                    // 이 플레이어가 이 차량의 seat에 탑승 중이라고 판단
                    const currentAngle = entity.getDynamicProperty("steering_angle") as number || 0;
                    const newAngle = currentAngle + InputHandler.STEERING_SENSITIVITY;
                    entity.setDynamicProperty("steering_angle", newAngle);
                    return;
                }
            }
        }
    }
}

new InputHandler();
