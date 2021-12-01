import BaseEntity from "./base/baseEntity"
import * as utils from "@dcl/ecs-scene-utils"
import UpdateEvent, {EventMessage} from "./events/updateEvent";
import global from "./core/global";

export class Capsule {
	private _withBattery = false

	constructor(transform: Transform, deltaPosition: number) {
		const startPos = transform.position;
		const endPos = new Vector3(startPos.x + deltaPosition, startPos.y, startPos.z);
		const cocon = new BaseEntity(new GLTFShape('models/cocon.glb'), transform)
		const coconBase = new BaseEntity(new GLTFShape('models/cocon_base.glb'), transform)
		coconBase.addComponent(new AudioSource(new AudioClip("audio/push_back_capsule.mp3")));

		coconBase.addComponent(
			new OnClick((): void => {
				coconBase.getComponent(utils.ToggleComponent).toggle()
				},
				{ distance: 5 }
			)
		)

		coconBase.addComponent(
			new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
				if (value === utils.ToggleState.On) {
					coconBase.getComponent(AudioSource).playOnce()

					coconBase.addComponentOrReplace(
						new utils.MoveTransformComponent(
							coconBase.getComponent(Transform).position,
							endPos,
							0.8,
							() => {
								if (this._withBattery) {
									global.events.fireEvent(new UpdateEvent(EventMessage.CAPSULE_OPEN))
									coconBase.removeComponent(utils.ToggleComponent)
								}
							}
						)
					)
				} else {
					coconBase.addComponentOrReplace(
						new utils.MoveTransformComponent(
							coconBase.getComponent(Transform).position,
							startPos,
							0.8
						)
					)
					coconBase.getComponent(AudioSource).playOnce()
				}
			})
		);
	}

	public init(): void {
		this._withBattery = true
	}
}

