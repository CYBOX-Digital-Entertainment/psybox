import { system, world } from "@minecraft/server";
import { PhysicsComponent } from "../../components/PhysicsComponent";
import { RigidBody } from "../core/RigidBody";
import { ForceManager } from "../core/ForceManager";
import { BlockCollision } from "./BlockCollision";
// 1틱(0.05초)마다 실행
system.runInterval(() => {
    const overworld = world.getDimension("overworld");
    for (const entity of overworld.getEntities()) {
        const profile = PhysicsComponent.getProfile(entity.typeId);
        if (!profile)
            continue;
        const body = new RigidBody(entity, profile);
        ForceManager.applyGravity(body);
        ForceManager.applyAirResistance(body);
        if (BlockCollision.checkGroundCollision(entity)) {
            body.setVelocity({ x: 0, y: 0, z: 0 });
            ForceManager.handleGroundCollision(body);
        }
    }
}, 1);
