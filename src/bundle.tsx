//import './test_cellx'
// import './test_mobx'
// import './test_whatsup'

import {
    Cause,
    conse,
    Conse,
    Context,
    delegate,
    Delegation,
    factor,
    Fractal,
    Stream,
    whatsUp,
    transaction,
} from 'whatsup'

interface Data {
    $key?: string
}

class Input<T extends Data = {}> extends Conse<T> {}

interface View {}

class Relation<T extends Model<any>> extends Cause<Model<T> | undefined> {
    readonly ctor: Ctor<Model<T>>

    private contexts = new Set<Context>()
    protected value?: T

    constructor(ctor: Ctor<T>) {
        super()
        this.ctor = ctor
    }

    *whatsUp(context: Context) {
        this.contexts.add(context)

        try {
            while (true) {
                if (!this.value) {
                    throw 'Model is not defined'
                }
                yield delegate(this.value)
            }
        } finally {
            this.contexts.delete(context)
        }
    }

    get() {
        return this.value
    }

    set(value: T | undefined) {
        this.value = value

        transaction(() => {
            for (const context of this.contexts) {
                context.update()
            }
        })
    }
}

class HasOne<T extends Model<any>> extends Relation<T> {
    set<D extends Data>(source: D | T | undefined) {
        if (source instanceof Model) {
            super.set(source as T)
            return this
        } else if (source !== undefined) {
            let model = this.get()

            if (!model) {
                super.set((model = new this.ctor(source)))
            }

            model.set(source)
        } else {
            super.set(undefined)
        }

        return this
    }
}

abstract class Model<T extends Data> extends Cause<T> {
    static _instances: Map<string, Model<any>>
    static get instances() {
        return this._instances || (this._instances = new Map())
    }
    static create<T extends Data>(this: new <M extends Model<T>>(data: T) => M, data: T) {
        return new this(data).set(data)
    }

    abstract validate(data: T): void

    readonly $key!: string

    constructor(data = {} as T) {
        super()

        this.validate(data)

        const { $key = '' } = data
        const { instances } = this.constructor as typeof Model

        if (!instances.has($key)) {
            this.$key = $key
            instances.set($key, this)
        }

        return instances.get($key) as this
    }

    set(data: T) {
        transaction(() => {
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
        })

        return this
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
    readonly name = new Name('')
    readonly age = new Age(NaN)

    validate(data: Data) {
        checkSignature(data, '$user')
    }

    *whatsUp() {
        while (true) {
            yield ` 
                Name: ${yield* this.name}
                Age: ${yield* this.age}
            `
        }
    }
}

class Message extends Model<MessageData> {
    readonly user = new HasOne(User)
    readonly text = new Text('')

    validate(data: Data) {
        checkSignature(data, '$message')
    }

    *whatsUp() {
        while (true) {
            yield `
                Text: ${yield* this.text}
                User: ${yield* this.user}
            `
        }
    }
}

const message: Message = Message.create({
    $message: true,
    $key: 1,
    text: 'Hello world',
    user: {
        $user: true,
        $key: 2,
        name: 'John',
        age: 33,
    },
})

whatsUp(message, (m) => console.log('>>>', m))

message.user.set({
    $user: true,
    $key: 3,
    name: 'Barry',
    age: 11,
})

// const user = User.create({
//     $user: true,
//     $key: 3,
//     name: 'Barry',
//     age: 11,
// })

console.dir(Message)
console.log(message)
console.dir(User)
console.log(user)

type Ctor<T extends Model<any>> = new <D extends Data>(data?: D) => T

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
