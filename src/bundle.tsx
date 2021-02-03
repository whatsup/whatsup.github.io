//import './test_cellx'
// import './test_mobx'
// import './test_whatsup'

import { Cause, conse, Conse, Context, delegate, Delegation, factor, Fractal, Stream } from 'whatsup'

interface Data {
    $key?: string
}

class Input<T extends Data = {}> extends Conse<T> {}

interface View {}

abstract class Relation<T> extends Cause<T> {
    abstract set(source: T): void

    readonly ctor: Ctor<Model<T>>

    constructor(ctor: Ctor<Model<T>>) {
        super()
        this.ctor = ctor
    }
}

class HasOne<T extends Data> extends Relation<T> {
    readonly model: Conse<Model<T> | null>

    constructor(ctor: Ctor<Model<T>>) {
        super(ctor)
        this.model = conse(null)
    }

    get() {
        return this.model.get()
    }

    set(source: T | Model<T>) {
        if (source instanceof Model) {
            this.model.set(source)
            return
        }

        let model = this.model.get()

        if (!model) {
            model = new this.ctor(source)
            this.model.set(model)
        }

        model.set(source)
    }

    *whatsUp() {
        while (true) {
            const model = yield* this.model

            if (!model) {
                throw 'Model is not defined'
            }

            yield delegate(model)
        }
    }
}

abstract class Model<T extends Data> extends Cause<T> {
    static _instances: Map<string, Model<any>>
    static get instances() {
        return this._instances || (this._instances = new Map())
    }

    abstract validate(data: T): void

    constructor(data: T) {
        super()

        this.validate(data)

        const { $key = '' } = data
        const { instances } = this.constructor as typeof Model

        if (!instances.has($key)) {
            instances.set($key, this)
        }

        return instances.get($key) as this
    }

    set(data: T) {
        for (const [key, value] of Object.entries(data)) {
            // if (value instanceof Relation) {
            //     const instance = new value.ctor()
            //     Reflect.set(this, key)
            // }
            const stream = Reflect.get(this, key)

            //debugger

            if (stream instanceof Conse || stream instanceof Model || stream instanceof Relation) {
                stream.set(value)
            }
        }
    }
}

class Name extends Conse<string> {}
class Text extends Conse<string> {}
class Age extends Conse<number> {}

interface UserData extends Data {
    $user: true
    name: string
    age: 33
}

interface MessageData extends Data {
    $message: true
    user: UserData
    text: string
}

function checkSignature(data: Data, sign: string) {
    if (!Reflect.has(data, sign)) {
        throw `This is not ${sign}`
    }
}

class User extends Model<UserData> {
    static readonly sign = '$user'
    readonly name = new Name('')
    readonly age = new Age(NaN)

    validate(data: Data) {
        checkSignature(data, '$user')
    }

    *whatsUp() {}
}

class Message extends Model<MessageData> {
    readonly user = new HasOne(User)
    readonly text = new Text('')

    validate(data: Data) {
        checkSignature(data, '$message')
    }

    *whatsUp() {}
}

const mData: MessageData = {
    $message: true,
    text: 'Hello world',
    user: {
        $user: true,
        name: 'John',
        age: 33,
    },
}
const m = new Message(mData)

m.set(mData)

console.log(m)

type Ctor<T extends Model<any>> = new <D extends Data>(data: D) => T

const Ctor = factor<Ctor<Model<any>>>()

class Factory<T extends Model<any>> extends Fractal<T | null> {
    *whatsUp(ctx: Context) {
        const input = ctx.find(Input)
        const ctor = ctx.find(Ctor)

        if (!input) {
            throw 'Input not found'
        }
        if (!ctor) {
            throw 'ModelCtor not found'
        }

        let lastModel: T | null = null

        while (true) {
            const data = yield* input

            try {
                const model = new ctor(data)

                model.set(data)

                yield (lastModel = model as T)
            } catch (e) {
                yield lastModel
            }
        }
    }
}

class Linq<T extends Model<any>> extends Fractal<T | null> {
    readonly ctor: Ctor<T>
    readonly model: Conse<T | null>

    constructor(ctor: Ctor<T>) {
        super()
        this.ctor = ctor
        this.model = conse(null)
    }

    *whatsUp(ctx: Context) {
        const input = ctx.find(Input)
        const ctor = ctx.find(Ctor)

        if (!input) {
            throw 'Input not found'
        }
        if (!ctor) {
            throw 'ModelCtor not found'
        }

        let lastModel: T | null = null

        while (true) {
            const data = yield* input

            try {
                const model = new ctor(data)

                model.set(data)

                yield (lastModel = model as T)
            } catch (e) {
                yield lastModel
            }
        }
    }
}

class Channel extends Fractal<Model<any>> {
    readonly input: Input

    constructor(input: Input) {
        super()
        this.input = input
    }

    *whatsUp(ctx: Context) {
        const modelCtor = ctx.find(Ctor)
    }
}

class Store {}

class Users {}
