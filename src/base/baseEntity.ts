export default class BaseEntity extends Entity {
  constructor(shape: GLTFShape, transform: TransformConstructorArgs) {
    super();

    engine.addEntity(this);
    this.addComponent(shape)
    this.addComponent(new Transform(transform))
  }
}