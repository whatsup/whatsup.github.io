import { Event } from '@fract/core'
import { Todo } from './todo'
import { FilterMode } from '../const'

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

export class ChangeFilterEvent extends Event {
    constructor(readonly mode: FilterMode) {
        super()
    }
}
