import styles from './user.scss'
import { Observable, observable, fractal, Fractal, Context } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { MODE, Mode } from '../factors'

export class User extends Fractal<JSX.Element> {
    readonly name: Observable<string>
    readonly age: Observable<number>
    readonly json = fractal(json, { thisArg: this })
    readonly view = fractal(view, { thisArg: this })
    readonly edit = fractal(edit, { thisArg: this })

    constructor(name: string, age: number) {
        super()
        this.name = observable(name)
        this.age = observable(age)
    }

    stream(ctx: Context) {
        switch (ctx.get(MODE)) {
            case Mode.View:
                return view.call(this)
            case Mode.Edit:
                return edit.call(this)
            case Mode.Json:
                return json.call(this)
        }
        throw 'Unknown Mode'
    }
}

function* json(this: User): Generator<JSX.Element> {
    while (true) {
        const data = {
            name: yield* this.name,
            age: yield* this.age,
        }
        const json = JSON.stringify(data, null, 4)

        yield <AsJson>{json}</AsJson>
    }
}

function* view(this: User): Generator<JSX.Element> {
    while (true) {
        yield (
            <AsView>
                <Property>
                    <PropertyName>Name</PropertyName>
                    <PropertyValue>{yield* this.name}</PropertyValue>
                </Property>
                <Property>
                    <PropertyName>Age</PropertyName>
                    <PropertyValue>{yield* this.age}</PropertyValue>
                </Property>
            </AsView>
        )
    }
}

function* edit(this: User): Generator<JSX.Element> {
    const handleNameInput = (e: any) => {
        this.name.set(e.target.value)
    }
    const handleAgeInput = (e: any) => {
        this.age.set(parseInt(e.target.value) || 0)
    }

    while (true) {
        yield (
            <AsEdit>
                <Property>
                    <PropertyName>Name</PropertyName>
                    <PropertyValue>
                        <NameInput onInput={handleNameInput} defaultValue={yield* this.name} />
                    </PropertyValue>
                </Property>
                <Property>
                    <PropertyName>Age</PropertyName>
                    <PropertyValue>
                        <AgeInput onInput={handleAgeInput} defaultValue={yield* this.age} />
                    </PropertyValue>
                </Property>
            </AsEdit>
        )
    }
}

function AsJson(props: FractalJSX.Attributes) {
    return <code className={styles.asJson}>{props.children}</code>
}

function AsEdit(props: FractalJSX.Attributes) {
    return <div className={styles.asEdit}>{props.children}</div>
}

function AsView(props: FractalJSX.Attributes) {
    return <div className={styles.asView}>{props.children}</div>
}

function Property(props: FractalJSX.Attributes) {
    return <div className={styles.property}>{props.children}</div>
}

function PropertyName(props: FractalJSX.Attributes) {
    return <div className={styles.propertyName}>{props.children}</div>
}

function PropertyValue(props: FractalJSX.Attributes) {
    return <div className={styles.propertyValue}>{props.children}</div>
}

function NameInput(props: { onInput: (event: FractalJSX.FormEvent<HTMLInputElement>) => void; defaultValue: string }) {
    return <input type="text" className={styles.nameInput} onInput={props.onInput} defaultValue={props.defaultValue} />
}

function AgeInput(props: { onInput: (event: FractalJSX.FormEvent<HTMLInputElement>) => void; defaultValue: number }) {
    return <input type="text" className={styles.ageInput} onInput={props.onInput} defaultValue={props.defaultValue} />
}
