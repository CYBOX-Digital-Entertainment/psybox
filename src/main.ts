
import { world, system, Entity, Player, Vector3, Dimension } from "@minecraft/server";
import { SlopePhysics } from "./physics/beta/SlopePhysics";
import { register } from "@minecraft/server-gametest";

/**
 * Psybox Physics Engine v2.1.3-beta
 * Advanced physics simulation for Minecraft Bedrock Edition
 * Compatible with Script API 2.0.0-beta.1.21.82-stable
 */
export class PsyboxPhysicsEngine {
    private static instance: PsyboxPhysicsEngine;
    private readonly slopePhysics: SlopePhysics;
    private readonly debugMode: Map<string, boolean> = new Map();
    private readonly physicsEntities: Set<string> = new Set();
    private readonly GRAVITY: number = -0.08;
    private readonly TERMINAL_VELOCITY: number = -3.92;

    private constructor() {
        this.slopePhysics = new SlopePhysics();
        this.initializeEvents();
        console.log("Psybox Physics Engine v2.1.3-beta initialized");
    }

    /**
     * Gets the singleton instance of the physics engine
     */
    public static getInstance(): PsyboxPhysicsEngine {
        if (!PsyboxPhysicsEngine.instance) {
            PsyboxPhysicsEngine.instance = new PsyboxPhysicsEngine();
        }
        return PsyboxPhysicsEngine.instance;
    }

    /**
     * Initializes all event listeners for the physics engine
     */
    private initializeEvents(): void {
        // Listen for script events
        system.afterEvents.scriptEventReceive.subscribe((event) => {
            const { id, sourceEntity, message } = event;

            if (!id.startsWith('psybox:')) return;

            switch (id) {
                case 'psybox:debug_on':
                    if (sourceEntity) {
                        this.debugMode.set(sourceEntity.id, true);
                        this.sendMessageToPlayer("§a[Psybox] 디버그 모드 활성화", sourceEntity);
                    }
                    break;
                case 'psybox:debug_off':
                    if (sourceEntity) {
                        this.debugMode.set(sourceEntity.id, false);
                        this.sendMessageToPlayer("§7[Psybox] 디버그 모드 비활성화", sourceEntity);
                    }
                    break;
                case 'psybox:slope_test':
                    this.startSlopeTest(sourceEntity);
                    break;
                case 'psybox:physics_info':
                    this.showPhysicsInfo(sourceEntity);
                    break;
                default:
                    break;
            }
        });

        // Run physics simulation every tick
        system.runInterval(() => {
            this.updatePhysics();
        }, 1);

        // Initialize physics on world load
        world.afterEvents.worldLoad.subscribe(() => {
            this.initializePhysicsWorld();
        });
    }

    /**
     * Initialize physics for each dimension
     */
    private initializePhysicsWorld(): void {
        const overworld = world.getDimension("overworld");
        const nether = world.getDimension("nether");
        const theEnd = world.getDimension("the_end");

        // Initialize physics for each dimension
        [overworld, nether, theEnd].forEach(dimension => {
            dimension.runCommand(`tellraw @a {"rawtext":[{"text":"§a[Psybox] 물리엔진 ${dimension.id} 차원 초기화 완료"}]}`);
        });
    }

    /**
     * Updates physics for all entities
     */
    private updatePhysics(): void {
        const entitiesToRemove = new Set<string>();

        for (const dimension of ["overworld", "nether", "the_end"]) {
            const dim = world.getDimension(dimension);
            const entities = dim.getEntities({
                excludeNames: ["item"]
            });

            for (const entity of entities) {
                if (!entity.isValid) {
                    entitiesToRemove.add(entity.id);
                    continue;
                }

                // Skip non-physics entities
                if (!this.isPhysicsEntity(entity)) continue;

                // Apply physics
                this.applyGravity(entity, dimension);
                this.slopePhysics.processEntity(entity);

                // Update debug display
                if (this.debugMode.get(entity.id)) {
                    this.updateDebugDisplay(entity);
                }
            }
        }

        // Clean up invalid entities
        for (const entityId of entitiesToRemove) {
            this.physicsEntities.delete(entityId);
            this.debugMode.delete(entityId);
        }
    }

    /**
     * Sends a message to a player entity
     */
    private sendMessageToPlayer(message: string, entity?: Entity): void {
        if (!entity) return;

        try {
            // Only Player entities have sendMessage method
            if (entity.typeId === 'minecraft:player') {
                // Use runCommand for tellraw to support non-player entities
                entity.runCommand(`tellraw @s {"rawtext":[{"text":"${message}"}]}`);
            }
        } catch (error) {
            console.error(`Failed to send message: ${error}`);
        }
    }

    /**
     * Checks if an entity should have physics applied
     */
    private isPhysicsEntity(entity: Entity): boolean {
        // Car:basic is our test entity
        if (entity.typeId === 'car:basic') {
            this.physicsEntities.add(entity.id);
            return true;
        }

        // Also handle other registered entities
        return this.physicsEntities.has(entity.id);
    }

    /**
     * Applies gravity to an entity
     */
    private applyGravity(entity: Entity, dimensionId: string): void {
        // Apply different gravity based on dimension
        let gravityMultiplier = 1.0;

        switch (dimensionId) {
            case "nether":
                gravityMultiplier = 1.2;
                break;
            case "the_end":
                gravityMultiplier = 0.6;
                break;
            default:
                gravityMultiplier = 1.0;
                break;
        }

        const gravity = this.GRAVITY * gravityMultiplier;
        const velocity = entity.getVelocity();

        // Apply gravity only if entity is not at terminal velocity
        if (velocity.y > this.TERMINAL_VELOCITY) {
            entity.applyImpulse({
                x: 0,
                y: gravity,
                z: 0
            });
        }
    }

    /**
     * Updates the debug display for an entity
     */
    private updateDebugDisplay(entity: Entity): void {
        const velocity = entity.getVelocity();
        const position = entity.location;
        const isGrounded = this.slopePhysics.isEntityGrounded(entity);
        const slopeInfo = this.slopePhysics.getSlopeInfo(entity);

        const displayText = 
            `§e위치: §f${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}\n` +
            `§e속도: §f${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}\n` +
            `§e지면 접촉: §f${isGrounded ? '§a예' : '§c아니오'}\n` +
            `§e경사면: §f${slopeInfo.isOnSlope ? '§a미끄러짐' : '§7평지'}\n` +
            `§e경사각도: §f${slopeInfo.angle.toFixed(1)}°\n` +
            `§e경사강도: §f${slopeInfo.strength.toFixed(2)}`;

        entity.runCommand(`title @s actionbar ${displayText}`);
    }

    /**
     * Starts a slope test by creating a test entity
     */
    private startSlopeTest(sourceEntity?: Entity): void {
        if (!sourceEntity) return;

        try {
            const testLocation = {
                x: sourceEntity.location.x,
                y: sourceEntity.location.y + 2,
                z: sourceEntity.location.z
            };

            const testEntity = sourceEntity.dimension.spawnEntity("car:basic" as any, testLocation);
            this.debugMode.set(testEntity.id, true);
            this.physicsEntities.add(testEntity.id);

            this.sendMessageToPlayer("§a[Psybox] 경사면 테스트 시작", sourceEntity);
            this.sendMessageToPlayer("§7계단이나 반블럭 경사면에 서보세요!", sourceEntity);
        } catch (error) {
            console.error(`Failed to start slope test: ${error}`);
        }
    }

    /**
     * Shows physics information
     */
    private showPhysicsInfo(sourceEntity?: Entity): void {
        if (!sourceEntity) return;

        const activeEntities = this.physicsEntities.size;
        this.sendMessageToPlayer(`§a[Psybox] 물리엔진 정보:\n§f활성 엔티티: ${activeEntities}개`, sourceEntity);
    }

    /**
     * Creates a vehicle entity with physics properties
     */
    public createVehicle(sourceEntity?: Entity): void {
        if (!sourceEntity) return;

        try {
            const testLocation = {
                x: sourceEntity.location.x,
                y: sourceEntity.location.y + 2,
                z: sourceEntity.location.z
            };

            const vehicleEntity = sourceEntity.dimension.spawnEntity("car:basic" as any, testLocation);
            this.debugMode.set(vehicleEntity.id, true);
            this.physicsEntities.add(vehicleEntity.id);

            // Set dynamic properties for physics
            vehicleEntity.setDynamicProperty("physics:mass", 1500);
            vehicleEntity.setDynamicProperty("physics:friction", 0.8);

            this.sendMessageToPlayer("§a[Psybox] 차량 생성 완료", sourceEntity);
        } catch (error) {
            console.error(`Failed to create vehicle: ${error}`);
        }
    }

    /**
     * Applies impulse force to an entity
     */
    public applyForce(entity: Entity, horizontalForce: Vector3, verticalStrength: number): void {
        if (!entity.isValid) return;

        try {
            // Combine horizontal and vertical forces
            entity.applyImpulse({
                x: horizontalForce.x,
                y: verticalStrength,
                z: horizontalForce.z
            });
        } catch (error) {
            console.error(`Failed to apply force: ${error}`);
        }
    }
}

// Initialize the physics engine
const physicsEngine = PsyboxPhysicsEngine.getInstance();
