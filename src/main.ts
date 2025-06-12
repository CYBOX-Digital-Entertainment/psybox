import { world, system } from "@minecraft/server";
import { getRegisteredCars } from "./registry";

const SPEED_INCREMENT = 0.1;

const directions = [
  { dir: "east",  dx:  SPEED_INCREMENT, dz: 0 },
  { dir: "north", dx: 0, dz: -SPEED_INCREMENT },
  { dir: "south", dx: 0, dz:  SPEED_INCREMENT },
  { dir: "west",  dx: -SPEED_INCREMENT, dz: 0 },
] as const;

system.runInterval(() => {
  const overworld = world.getDimension("overworld");

  for (const [entity, config] of getRegisteredCars(overworld)) {
    const loc = entity.location;
    const block = entity.dimension.getBlock({ x: loc.x, y: loc.y - 1, z: loc.z });
    if (!block) continue;

    const blockType = block.typeId;
    let { x: vx, z: vz } = entity.getVelocity();

    const slabApplied = directions.some(({ dir, dx, dz }) => {
      const adjacent = block[dir]?.();
      const adjType = adjacent?.typeId ?? "";

      if ((adjType.includes("slab") && !blockType.includes("slab")) ||
          (blockType.includes("slab") && adjType.includes("air"))) {
        vx += dx;
        vz += dz;
        entity.applyImpulse({ x: vx, y: config.yImpulse, z: vz });
        return true;
      }
      return false;
    });

    if (slabApplied) continue;
    if (!blockType.includes("stairs")) continue;

    const dirId = block.permutation.getAllStates()["weirdo_direction"];
    switch (dirId) {
      case 1: vx += SPEED_INCREMENT; break;
      case 2: vz -= SPEED_INCREMENT; break;
      case 3: vz += SPEED_INCREMENT; break;
      case 0: vx -= SPEED_INCREMENT; break;
    }

    entity.applyImpulse({ x: vx, y: config.yImpulse, z: vz });
  }
}, 2);
