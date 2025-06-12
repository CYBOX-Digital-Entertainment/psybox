import { world } from "@minecraft/server";
if (!globalThis.CAR_CONFIGS) {
    globalThis.CAR_CONFIGS = new Map([
        ["car:basic", { yImpulse: -10 }],
    ]);
}
export function registerCarType(typeId, config) {
    globalThis.CAR_CONFIGS.set(typeId, config);
}
export function* getRegisteredCars(dim = world.getDimension("overworld")) {
    for (const [typeId, config] of globalThis.CAR_CONFIGS.entries()) {
        for (const e of dim.getEntities({ type: typeId })) {
            yield [e, config];
        }
    }
}
