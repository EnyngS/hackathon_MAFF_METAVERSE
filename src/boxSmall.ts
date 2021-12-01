import {Box} from "./box";

export class BoxSmall extends Box {
  constructor(transform: Transform) {
    super(new GLTFShape("models/box_small.glb"), transform)

    // Create physics body
    const body = new CANNON.Body({
      mass: 1, // kg
      position: new CANNON.Vec3(transform.position.x, transform.position.y, transform.position.z), // m
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    })

    this.setBody(body)
  }
}