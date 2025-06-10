interface VehiclePhysicsParams {
  mass: number;
  tire_friction: number;
  suspension_stiffness?: number;
}

interface Entity {
  getDynamicProperty(prop: "vehicle_physics"): VehiclePhysicsParams;
  setDynamicProperty(prop: "vehicle_physics", value: VehiclePhysicsParams): void;
}
