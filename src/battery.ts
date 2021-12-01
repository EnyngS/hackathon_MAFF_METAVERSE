import * as ui from "@dcl/ui-scene-utils";
import Global from "./core/global";
import BaseEntity from "./base/baseEntity";

export default class Battery extends BaseEntity {
  // @ts-ignore
  private _icon: ui.SmallIcon

  constructor(transform: Transform) {
    super(new GLTFShape('models/squid_battery.glb'), transform)
	  this.addComponent(new AudioSource(new AudioClip("audio/Take_disk__battery.mp3")))
    // Create trigger for key
    this.addComponent(
      new OnPointerDown(()=>{
        this.getComponent(Transform).scale.setAll(0)
			  this._icon = new ui.SmallIcon("images/battery.jpg", -50, 200, 100, 100)
        this.getComponent(AudioSource).playOnce()
        Global.HAS_BATTERY = true
		 },
        { hoverText: "Puck up", distance: 8 })
    )
  }

  public hideIcon(): void {
    this._icon.hide()
  }
}