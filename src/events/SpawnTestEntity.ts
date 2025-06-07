import { world } from "@minecraft/server";

// 엔티티 소환 시 초기 속도만 부여 (네임태그 설정 제거)
world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (entity.typeId === "cybox:spirra") {
    entity.applyImpulse({ x: 0, y: 1.5, z: 0 });
  }
});
