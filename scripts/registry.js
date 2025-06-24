globalThis.CAR_CONFIGS ?? (globalThis.CAR_CONFIGS = new Map());

export function registerCarPhysics(typeId, config) {
  globalThis.CAR_CONFIGS.set(typeId, config);
}

export function* getRegisteredCars(dim) {
  for (const [typeId, config] of globalThis.CAR_CONFIGS.entries()) {
    for (const entity of dim.getEntities({ type: typeId }))
      yield [entity, config];
  }
}