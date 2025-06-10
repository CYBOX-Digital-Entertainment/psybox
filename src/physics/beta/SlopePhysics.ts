
import { Vector3, Entity, Dimension } from "@minecraft/server";

/**
 * Interface for surface material friction coefficients
 */
interface FrictionCoefficients {
    [key: string]: number;
    stone: number;
    dirt: number;
    grass: number;
    wood: number;
    ice: number;
    default: number;
}

/**
 * Handles slope physics calculations and detection
 */
export class SlopePhysics {
    private readonly GRAVITY: number = -0.08;
    private readonly MAX_SLOPE_ANGLE: number = 60; // degrees
    private readonly MIN_SLOPE_ANGLE: number = 5; // degrees
    private readonly MAX_GROUND_DISTANCE: number = 0.6;
    private readonly FRICTION_COEFFICIENTS: FrictionCoefficients = {
        stone: 0.7,
        dirt: 0.6,
        grass: 0.65,
        wood: 0.5,
        ice: 0.05,
        default: 0.6
    };

    /**
     * Process an entity's physics on slopes
     */
    public processEntity(entity: Entity): void {
        if (!entity.isValid) return;

        try {
            // Check if entity is on ground
            const isGrounded = this.isEntityGrounded(entity);

            // Set dynamic property for ground state
            entity.setDynamicProperty("physics:isgrounded", isGrounded);

            if (isGrounded) {
                // Get slope information
                const slopeInfo = this.getSlopeInfo(entity);

                // Set dynamic properties for slope
                entity.setDynamicProperty("physics:issliding", slopeInfo.isOnSlope);
                entity.setDynamicProperty("physics:slopeangle", slopeInfo.angle);
                entity.setDynamicProperty("physics:slopestrength", slopeInfo.strength);

                // Apply slope physics if on a slope
                if (slopeInfo.isOnSlope) {
                    this.applySlopeForces(entity, slopeInfo);
                }
            }
        } catch (error) {
            console.error(`Slope physics error: ${error}`);
        }
    }

    /**
     * Check if an entity is touching the ground
     */
    public isEntityGrounded(entity: Entity): boolean {
        try {
            const position = entity.location;
            const velocity = entity.getVelocity();

            // Quick check: if moving upward, not grounded
            if (velocity.y > 0.05) return false;

            // Check block below
            const blockBelow = entity.dimension.getBlock({
                x: Math.floor(position.x),
                y: Math.floor(position.y - 0.1),
                z: Math.floor(position.z)
            });

            // If no block below or block is air, not grounded
            if (!blockBelow || blockBelow.typeId === "minecraft:air") return false;

            // Advanced check: ray cast down
            const downOffset = 0.5; // Check this distance below the entity
            const rayOptions = {
                maxDistance: downOffset
            };

            const blockHit = entity.dimension.getBlockFromViewDirection(rayOptions);
            return blockHit !== undefined;
        } catch (error) {
            console.error(`Ground check error: ${this.safeStringify(error)}`);
            return false;
        }
    }

    /**
     * Get information about the slope under the entity
     */
    public getSlopeInfo(entity: Entity): { isOnSlope: boolean, angle: number, strength: number, direction: Vector3 } {
        const defaultResult = { isOnSlope: false, angle: 0, strength: 0, direction: { x: 0, y: 0, z: 0 } };

        try {
            // If not grounded, no slope
            if (!this.isEntityGrounded(entity)) return defaultResult;

            const position = entity.location;

            // Check blocks in all 8 directions around entity
            const directions = [
                { x: 1, z: 0 },   // East
                { x: 1, z: 1 },   // Southeast
                { x: 0, z: 1 },   // South
                { x: -1, z: 1 },  // Southwest
                { x: -1, z: 0 },  // West
                { x: -1, z: -1 }, // Northwest
                { x: 0, z: -1 },  // North
                { x: 1, z: -1 }   // Northeast
            ];

            let maxAngle = 0;
            let maxDirection = { x: 0, y: 0, z: 0 };

            for (const dir of directions) {
                // Check for height difference in this direction
                const blockPos = {
                    x: Math.floor(position.x + dir.x),
                    y: Math.floor(position.y - 0.1),
                    z: Math.floor(position.z + dir.z)
                };

                const blockAtPos = entity.dimension.getBlock(blockPos);
                if (!blockAtPos) continue;

                // Check blocks above and below to determine slope
                const blockAbove = entity.dimension.getBlock({
                    x: blockPos.x,
                    y: blockPos.y + 1,
                    z: blockPos.z
                });

                const blockBelow = entity.dimension.getBlock({
                    x: blockPos.x,
                    y: blockPos.y - 1,
                    z: blockPos.z
                });

                // Calculate slope angle based on blocks
                let angle = 0;

                // Stairs and slabs have predefined angles
                if (blockAtPos.typeId.includes("stairs")) {
                    angle = 30; // Approx 30 degrees for stairs
                } else if (blockAtPos.typeId.includes("slab")) {
                    angle = 15; // Approx 15 degrees for slabs
                } else if (blockAbove && blockAbove.typeId === "minecraft:air" && 
                           blockBelow && blockBelow.typeId !== "minecraft:air") {
                    // Calculate angle based on block layout
                    angle = 45; // Approximate for regular blocks
                }

                // Keep track of steepest slope
                if (angle > maxAngle) {
                    maxAngle = angle;
                    maxDirection = { 
                        x: -dir.x, // Invert direction to slide downhill
                        y: -0.1,   // Slight downward force
                        z: -dir.z  // Invert direction to slide downhill
                    };
                }
            }

            // Check if angle is within slope range
            const isOnSlope = maxAngle >= this.MIN_SLOPE_ANGLE && maxAngle <= this.MAX_SLOPE_ANGLE;

            // Calculate slope strength (0-1) based on angle
            const strength = isOnSlope ? 
                (maxAngle - this.MIN_SLOPE_ANGLE) / (this.MAX_SLOPE_ANGLE - this.MIN_SLOPE_ANGLE) : 0;

            return {
                isOnSlope,
                angle: maxAngle,
                strength,
                direction: maxDirection
            };
        } catch (error) {
            console.error(`Slope info error: ${this.safeStringify(error)}`);
            return defaultResult;
        }
    }

    /**
     * Apply physics forces for entities on slopes
     */
    private applySlopeForces(entity: Entity, slopeInfo: { direction: Vector3, strength: number, angle: number }): void {
        try {
            // Get entity information
            const velocity = entity.getVelocity();
            const mass = entity.getDynamicProperty("physics:mass") as number || 70; // Default 70kg

            // Get surface type for friction
            const position = entity.location;
            const blockBelow = entity.dimension.getBlock({
                x: Math.floor(position.x),
                y: Math.floor(position.y - 0.1),
                z: Math.floor(position.z)
            });

            // Get surface type and apply corresponding friction
            let surfaceType = "default";
            if (blockBelow) {
                const blockId = blockBelow.typeId;
                if (blockId.includes("stone")) surfaceType = "stone";
                else if (blockId.includes("dirt")) surfaceType = "dirt";
                else if (blockId.includes("grass")) surfaceType = "grass";
                else if (blockId.includes("wood")) surfaceType = "wood";
                else if (blockId.includes("ice")) surfaceType = "ice";
            }

            // Get friction coefficient for this surface
            const friction = this.FRICTION_COEFFICIENTS[surfaceType] || this.FRICTION_COEFFICIENTS.default;

            // Calculate sliding force based on angle, mass and friction
            const gravityForce = Math.sin(slopeInfo.angle * Math.PI / 180) * this.GRAVITY * mass;
            const frictionForce = friction * Math.cos(slopeInfo.angle * Math.PI / 180) * mass;

            // Calculate net force
            const netForce = gravityForce - frictionForce;

            // Only apply force if net force is positive (overcomes friction)
            if (netForce > 0) {
                // Calculate slide vector
                const horizontalForce = {
                    x: slopeInfo.direction.x * slopeInfo.strength * 0.1,
                    y: 0,
                    z: slopeInfo.direction.z * slopeInfo.strength * 0.1
                };

                const verticalStrength = slopeInfo.direction.y * 0.05;

                // Apply the impulse with a single Vector3
                entity.applyImpulse({
                    x: horizontalForce.x,
                    y: verticalStrength,
                    z: horizontalForce.z
                });
            }
        } catch (error) {
            console.error(`Apply slope forces error: ${this.safeStringify(error)}`);
        }
    }

    /**
     * Safely stringify an error object
     */
    private safeStringify(error: unknown): string {
        try {
            if (error instanceof Error) {
                return error.toString();
            }
            return String(error);
        } catch {
            return "Unknown error";
        }
    }
}
