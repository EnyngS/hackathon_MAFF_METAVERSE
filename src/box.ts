import PhysicsEntity from "./base/physicsEntity";
import Vec3 = CANNON.Vec3;
// import { movePlayerTo } from '@decentraland/RestrictedActions'

export class Box extends PhysicsEntity {

  public isActive: boolean = false

  // @ts-ignore
  private _body: CANNON.Body
  // @ts-ignore
  private _world: CANNON.World

  constructor(shape: GLTFShape, transform: Transform) {
    super(shape, transform);
	 
	 this.addComponent(new AudioSource(new AudioClip("audio/quit_box.mp3")));
  }

  protected setBody(body: CANNON.Body) {
    this._body = body
  }

  public getBody(): CANNON.Body {
    return this._body
  }

  public init(cannonMaterial: CANNON.Material, world: CANNON.World): void {
    this._world = world
    const body = this._body
	 
    body.sleep()
    body.material = cannonMaterial
    body.linearDamping = 0.4
    body.angularDamping = 0.4
    world.addBody(body)

    this.addComponent(
      new OnPointerDown(
        () => {
          this.playerPickup();
			 
        },
        { hoverText: "Pick up", distance: 6, button: ActionButton.PRIMARY }
      )
    )
  }

  public playerPickup(): void {
    this.isActive = true
    this._body.sleep()
    this._body.position.set(Camera.instance.position.x, Camera.instance.position.y, Camera.instance.position.z)
    this.setParent(Attachable.FIRST_PERSON_CAMERA)
    this.getComponent(Transform).position.set(0, -0.2, 1.5);
	 
  }

  public playerDrop(dropDirection: Vector3): void {
    if (Camera.instance.position.equals(Vector3.Zero()))
      return

    this.isActive = false
    this.setParent(null)
	 
	 this.getComponent(AudioSource).playOnce();
    // Physics
    this._body.wakeUp()
    this._body.velocity.setZero()
    this._body.angularVelocity.setZero()
    this._body.position.set(
      Camera.instance.feetPosition.x + dropDirection.x * 1.4,
      Camera.instance.position.y + 0.2,
      Camera.instance.feetPosition.z + dropDirection.z * 1.4
    )
  }
}