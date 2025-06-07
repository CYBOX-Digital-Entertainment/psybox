import { world, Entity } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (entity.typeId === "cybox:spirra") {
    entity.nameTag = "물리 엔진 테스트 엔티티";
    entity.applyImpulse({ x: 0, y: 1.5, z: 0 });
  }
});
