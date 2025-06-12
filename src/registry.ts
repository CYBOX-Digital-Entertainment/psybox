import { world, Entity } from "@minecraft/server";

type CarConfig = {
  yImpulse: number;
};

declare global {
  var CAR_CONFIGS: Map<string, CarConfig>;
}

if (!globalThis.CAR_CONFIGS) {
  globalThis.CAR_CONFIGS = new Map<string, CarConfig>([
    ["car:basic", { yImpulse: -10 }],
  ]);
}

export function registerCarType(typeId: string, config: CarConfig) {
  globalThis.CAR_CONFIGS.set(typeId, config);
}

export function* getRegisteredCars(dim = world.getDimension("overworld")): Generator<[Entity, CarConfig]> {
  for (const [typeId, config] of globalThis.CAR_CONFIGS.entries()) {
    for (const e of dim.getEntities({ type: typeId })) {
      yield [e, config];
    }
  }
}
