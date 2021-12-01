import ActionSystem from "./systems/actionSystem";
import BaseEntity from "./base/baseEntity";
import Global from "./core/global";
import * as ui from "@dcl/ui-scene-utils";
import UpdateEvent, {EventMessage} from "./events/updateEvent";
import global from "./core/global";
import Battery from "./battery";
export enum Move {
  FORWARD = 'FORWARD',
  BACK = 'BACK',
}

export enum Rotate {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export default class Squid extends BaseEntity {

  private readonly _actionSystem: ActionSystem
  private readonly _elements: BaseEntity[]

  // @ts-ignore
  private _battery: Battery
  private _isActive: boolean = false

  constructor(transform: TransformConstructorArgs) {
    super(new GLTFShape('models/squid.glb'), transform);
    this.addComponent(new OnPointerDown(()=> this._checkState(),
      {
        button: ActionButton.PRIMARY,
        distance: 4
      })
    )

    this._elements = [this]
    this._actionSystem = new ActionSystem(this._elements)
    engine.addSystem(this._actionSystem)
    global.events.addListener(UpdateEvent, null, ({ message }) => {
      if (message === EventMessage.CAPSULE_OPEN && !this._battery) {
        this._battery = new Battery(new Transform({ position: new Vector3(15, -0.8, 10.5), rotation: new Quaternion(-0.135, 0, 0) }))
      }
    })
  }

  private _checkState(): void {
    if (Global.HAS_BATTERY && !this._isActive) {
      this._isActive = true
      this.removeComponent(OnPointerDown)
      this._battery.getComponent(Transform).position = this.getComponent(Transform).position
      this._battery.getComponent(Transform).rotation = this.getComponent(Transform).rotation
      this._battery.getComponent(Transform).scale = Vector3.One()
      this._battery.hideIcon()
      this._elements.push(this._battery)

      this.addComponent(new AudioSource(new AudioClip("audio/quit_box.mp3")))
      this.getComponent(AudioSource).playOnce()
    } else {
      ui.displayAnnouncement('Not enough energy');
    }
  }

  public move (dir?: Move):void {
    if (!Global.HAS_BATTERY) return
	// this.getComponent(AudioSource).playOnce()
    switch (dir) {
      case Move.FORWARD:
        this._actionSystem.moveForward();
        break;
      case Move.BACK:
        this._actionSystem.moveBack()
        break;
      default:
        this._actionSystem.moveStop()
    }
  }

  public rotate (dir?: Rotate):void {
    if (!Global.HAS_BATTERY) return
    switch (dir) {
      case Rotate.RIGHT:
        this._actionSystem.turnRight()
        break;
      case Rotate.LEFT:
        this._actionSystem.turnLeft()
        break;
      default:
        this._actionSystem.turnStop()
    }
  }
}
