import Squid from "./squid";
import BaseEntity from "./base/baseEntity";
import {Capsule} from "./capsule";
import {Box} from "./box";
import PhysicsSystem from "./systems/physicsSystem";
import * as utils from '@dcl/ecs-scene-utils'

import Terminal from "./terminal";
import {BoxSmall} from "./boxSmall";
import {BoxBig} from "./boxBig";
import Pill from "./pill";
import global from "./core/global";

const squid = new Squid(new Transform({ position: new Vector3(5,0.1,10),rotation: Quaternion.Euler(0, 135, 0) }));
const terminal = new Terminal(new Transform({ position: new Vector3(3,0.1,3),rotation: Quaternion.Euler(0, 180, 0) }))
const pill = new Pill(new Transform({ position: new Vector3(12, 7.5, 6) }));
terminal.init(squid)


const floor = new BaseEntity(new GLTFShape("models/floor.glb"), { position: new Vector3(8, 0.1, 8) });
const wall = new BaseEntity(new GLTFShape('models/wall.glb'),{ position: new Vector3(3.8, 0, 8.1) });

let wallCollider: BaseEntity
let oneSound = 1
floor.addComponent(
  new utils.TriggerComponent(
    new utils.TriggerBoxShape(
      new Vector3(12, 12, 12),
      new Vector3(0, 0, 0)
    ),
    {
      onCameraEnter: () => {
        if (global.HAS_PILL) return
        if (!wallCollider) {
          wallCollider = new BaseEntity(new GLTFShape("models/wall_collider.glb"), { position: wall.getComponent(Transform).position.clone() })
          pill.init(wallCollider)
        }

        floor.removeComponent(utils.ToggleComponent)
        if (oneSound) {
          floor.getComponent(AudioSource).playOnce();
          oneSound = 0
        }
      }
    }
  )
)

new Capsule( new Transform({ position: new Vector3(15.2, 0.1, 2) ,rotation: Quaternion.Euler(0, 270, 0) }), -1.5);
new Capsule( new Transform({ position: new Vector3(15.2, 0.1, 5) ,rotation: Quaternion.Euler(0, 270, 0) }), -1.5);
new Capsule( new Transform({ position: new Vector3(15.2, 0.1, 8) ,rotation: Quaternion.Euler(0, 270, 0) }), -1.5);
new Capsule( new Transform({ position: new Vector3(15.2, 0.1, 11) ,rotation: Quaternion.Euler(0, 270, 0) }), -1.5).init();
new Capsule( new Transform({ position: new Vector3(15.2, 0.1, 14) ,rotation: Quaternion.Euler(0, 270, 0) }), -1.5);

// Create balls
const boxSmall = new BoxSmall(new Transform({ position: new Vector3(10, 0.5, 14) }))
const boxBig = new BoxBig(new Transform({ position: new Vector3(12, 0.5, 14) }))

const boxes: Box[] = [boxSmall, boxBig]
const physicsSystem = new PhysicsSystem()

boxes.forEach(box => {
  physicsSystem.addEntity(box)
})


// Controls
// "E" key up
Input.instance.subscribe("BUTTON_UP", ActionButton.PRIMARY, false, (e) => {
  squid.rotate();
  squid.move();
})

// "MOUSE LEFT" is up
Input.instance.subscribe("BUTTON_UP", ActionButton.POINTER, false, (e) => {
  squid.rotate();
  squid.move();
  boxes.forEach(box => {
    if (box.isActive) {
      const throwDirection = Vector3.Forward().rotate(Camera.instance.rotation)
      box.playerDrop(throwDirection)
    }
  })
})
