import { Event } from 'whatsup'
import { Todo } from './todo'

export class CreateEvent extends Event {
    constructor(readonly name: string) {
        super()
    }
}

export class RemoveEvent extends Event {
    constructor(readonly todo: Todo) {
        super()
    }
}

export class RemoveCompletedEvent extends Event {}
