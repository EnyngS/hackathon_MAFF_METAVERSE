import PhysicsEntity from "../base/physicsEntity";

export default class PhysicsSystem implements ISystem {

  // Set high to prevent tunnelling
  private readonly FIXED_TIME_STEPS = 1.0 / 60
  private readonly MAX_TIME_STEPS = 10

  private readonly _world: CANNON.World

  private readonly _entityMaterial: CANNON.Material
  private readonly _entities: Array<PhysicsEntity>

  constructor() {
    engine.addSystem(this)

    // Setup world
    const world = new CANNON.World()
    world.quatNormalizeSkip = 0
    world.quatNormalizeFast = false
    world.gravity.set(0, -9.82, 0)

    // Setup ground
    const physicsMaterial = new CANNON.Material("groundMaterial")
    const entityContactMaterial = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, { friction: 5, restitution: 0 })
    world.addContactMaterial(entityContactMaterial)

    // Create a ground
    const groundShape: CANNON.Plane = new CANNON.Plane()
    const groundBody: CANNON.Body = new CANNON.Body({ mass: 0 })
    groundBody.addShape(groundShape)
    groundBody.material = physicsMaterial
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    groundBody.position.set(0, 0.05, 0)
    world.addBody(groundBody)

    this._world = world
    this._entityMaterial = physicsMaterial
    this._entities = new Array<PhysicsEntity>()
  }

  update(dt: number): void {
    this._world.step(this.FIXED_TIME_STEPS, dt, this.MAX_TIME_STEPS)
    this._entities.forEach(entity => {
      if (!entity.isActive) {
        entity.getComponent(Transform).position.copyFrom(entity.getBody().position)
        entity.getComponent(Transform).rotation.copyFrom(entity.getBody().quaternion)
      }
    })
  }

  public addEntity(entity: PhysicsEntity): void {
    entity.init(this._entityMaterial, this._world)
    this._entities.push(entity)
  }
}