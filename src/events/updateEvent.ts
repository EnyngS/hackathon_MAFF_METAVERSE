export enum EventMessage {
  CAPSULE_OPEN = "CAPSULE_OPEN"
}

@EventConstructor()
export default class UpdateEvent {
  public message: string
  constructor(message: EventMessage) {
    this.message = message
  }
}