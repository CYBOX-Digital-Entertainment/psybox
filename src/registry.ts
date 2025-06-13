import { Entity, Dimension } from '@minecraft/server';

export type CarConfig = { weight: number }
declare global { var CAR_CONFIGS: Map<string, CarConfig> }

globalThis.CAR_CONFIGS ??= new Map<string, CarConfig>();

export function registerCarPhysics(typeId: string, config: CarConfig) {
  globalThis.CAR_CONFIGS.set(typeId, config);
}

export function* getRegisteredCars(dim: Dimension): Generator<[Entity, CarConfig]> {
  for (const [typeId, config] of globalThis.CAR_CONFIGS.entries()) {
    for (const entity of dim.getEntities({ type: typeId })) yield [entity, config];
  }
}
