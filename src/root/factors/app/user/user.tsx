import React from 'react'
import styles from './user.scss'
import { fraction, Fractal, Context, Fraction } from '@fract/core'
import { MODE, Mode } from '../../factors'

export class User extends Fractal<JSX.Element> {
    readonly name: Fraction<string>
    readonly age: Fraction<number>

    constructor(name: string, age: number) {
        super()
        this.name = fraction(name)
        this.age = fraction(age)
    }

    collector(ctx: Context) {
        switch (ctx.get(MODE)) {
            case Mode.Json:
                return userAsJson.call(this)
            case Mode.View:
                return userAsView.call(this)
            case Mode.Edit:
                return userAsEdit.call(this)
        }

        throw 'Unknown MODE'
    }
}

async function* userAsJson(this: User) {
    while (true) {
        const data = {
            name: yield* this.name,
            age: yield* this.age,
        }

        yield <AsJson>{JSON.stringify(data, null, 4)}</AsJson>
    }
}

async function* userAsView(this: User): AsyncGenerator<JSX.Element> {
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

async function* userAsEdit(this: User): AsyncGenerator<JSX.Element> {
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

type Props = { children: string | number | JSX.Element | JSX.Element[] }

function AsJson(props: Props) {
    return <code className={styles.asJson}>{props.children}</code>
}

function AsEdit(props: Props) {
    return <div className={styles.asEdit}>{props.children}</div>
}

function AsView(props: Props) {
    return <div className={styles.asView}>{props.children}</div>
}

function Property(props: Props) {
    return <div className={styles.property}>{props.children}</div>
}

function PropertyName(props: Props) {
    return <div className={styles.propertyName}>{props.children}</div>
}

function PropertyValue(props: Props) {
    return <div className={styles.propertyValue}>{props.children}</div>
}

function NameInput(props: { onInput: (e: any) => void; defaultValue: string }) {
    return <input type="text" className={styles.nameInput} onInput={props.onInput} defaultValue={props.defaultValue} />
}

function AgeInput(props: { onInput: (e: any) => void; defaultValue: number }) {
    return <input type="text" className={styles.ageInput} onInput={props.onInput} defaultValue={props.defaultValue} />
}
