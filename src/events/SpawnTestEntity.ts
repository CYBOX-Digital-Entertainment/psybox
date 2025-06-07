// src/events/SpawnTestEntity.ts
import { world } from "@minecraft/server";

world.events.entityCreate.subscribe(({ entity }) => {
  if (entity.typeId === "cybox:spirra") {
    entity.setVelocity({ x: 0, y: 1.5, z: 0 });
  }
});
