// src/events/SpawnTestEntity.ts
import { world } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (entity.typeId === "cybox:spirra") {
    entity.nameTag = "물리 테스트 엔티티";
    entity.applyImpulse({ x: 0, y: 2, z: 0 });  // 더 강한 점프력으로 테스트
  }
});
