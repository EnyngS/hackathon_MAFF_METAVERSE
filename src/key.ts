import * as utils from '@dcl/ecs-scene-utils'
import * as ui from "@dcl/ui-scene-utils";
import Global from "./core/global";
import BaseEntity from "./base/baseEntity";

export default class Key extends BaseEntity {
  // @ts-ignore
  private _icon: ui.SmallIcon

  constructor(transform: Transform) {
    super(new GLTFShape('models/key_card.glb'), transform)

    this.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(0, 255, 0)))
	 this.addComponent(new AudioSource(new AudioClip("audio/Take_disk__battery.mp3")))
	//
	//  )
	 this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(
          new Vector3(0.3, 0.3, 0.3)
        ),
        {
			  
          onCameraEnter: () => {
				this.getComponent(AudioSource).playOnce()
            this.getComponent(Transform).scale.setAll(0)
            this._icon = new ui.SmallIcon("images/key.jpg", -50, 355, 100, 100)
            Global.HAS_KEY = true
          },
          onCameraExit: () => {
            engine.removeEntity(this)
          },
        }
      ))
  }

  public hideIcon(): void {
    this._icon.hide()
  }
}
