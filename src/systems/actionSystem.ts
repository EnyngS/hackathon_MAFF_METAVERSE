import BaseEntity from "../base/baseEntity";

export default class ActionSystem implements ISystem {

  private readonly _entity: BaseEntity[]
  private _turnDirection: number
  private _moveDirection: number

  constructor(entity: BaseEntity[]) {
    this._entity = entity
    this._turnDirection = 0
    this._moveDirection = 0
  }

  update () {
    if (this._moveDirection) {
      const direction = this._moveDirection
      if (direction != 0) {
        this._entity.forEach(item => {
          const transform = item.getComponent(Transform)
          const distance = Vector3.Forward().rotate(transform.rotation)
          const sign = direction < 0 ? -1 : 1
          transform.translate(distance.scale(sign * 0.05))
        })
      }
    }

    if (this._turnDirection) {
      const direction = this._turnDirection
      const sign = direction < 0 ? -1 : 1
      this._entity.forEach(item => {
        const transform = item.getComponent(Transform)
        if (sign > 0)
          transform.rotate(Vector3.Up(), 2)
        else
          transform.rotate(Vector3.Down(), 2)
      })
    }
  }

  public moveForward (): void {
    this._moveDirection = 1
  }

  public moveBack (): void {
    this._moveDirection = -1
  }

  public moveStop (): void {
    this._moveDirection = 0
  }

  public turnRight (): void {
    this._turnDirection = 1
  }

  public turnLeft (): void {
    this._turnDirection = -1
  }

  public turnStop (): void {
    this._turnDirection = 0
  }
}