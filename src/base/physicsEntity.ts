import BaseEntity from "./baseEntity";

export default class PhysicsEntity extends BaseEntity {
  public isActive: boolean = false

  constructor(shape: GLTFShape, transform: TransformConstructorArgs) {
    super(shape, transform);
	 
  }

  public init(cannonMaterial: CANNON.Material, world: CANNON.World): void {
    throw new Error('init method must be overwritten')
  }

  public getBody(): CANNON.Body {
    throw new Error('getBody method must be overwritten')
  }
}