import React from 'react'
import styles from './user.scss'
import { fraction, Emitter, Context, Fraction } from '@fract/core'
import { MODE, Mode } from './factors'

export class User extends Emitter<JSX.Element> {
    readonly name: Fraction<string>
    readonly age: Fraction<number>

    constructor(name: string, age: number) {
        super()
        this.name = fraction(name)
        this.age = fraction(age)
    }

    async *collector(ctx: Context) {
        switch (ctx.get(MODE)) {
            case Mode.Json:
                yield* userAsJson.call(this)
                break
            case Mode.View:
                yield* userAsView.call(this)
                break
            case Mode.Edit:
                yield* userAsEdit.call(this)
                break
        }
    }
}

async function* userAsJson(this: User) {
    while (true) {
        const data = {
            name: yield* this.name,
            age: yield* this.age,
        }

        console.log(data)

        yield <div className={styles.json}>{JSON.stringify(data, null, 4)}</div>
    }
}

async function* userAsView(this: User): AsyncGenerator<JSX.Element> {
    while (true) {
        yield (
            <div className={styles.userView}>
                <div className={styles.property}>
                    <div className={styles.propertyName}>Name</div>
                    <div className={styles.propertyValue}>{yield* this.name}</div>
                </div>
                <div className={styles.property}>
                    <div className={styles.propertyName}>Age</div>
                    <div className={styles.propertyValue}>{yield* this.age}</div>
                </div>
            </div>
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
            <div className={styles.userEdit}>
                <div className={styles.property}>
                    <div className={styles.propertyName}>Name</div>
                    <div className={styles.propertyValue}>
                        <input
                            className={styles.nameInput}
                            type="text"
                            onInput={handleNameInput}
                            defaultValue={yield* this.name}
                        />
                    </div>
                </div>
                <div className={styles.property}>
                    <div className={styles.propertyName}>Age</div>
                    <div className={styles.propertyValue}>
                        <input
                            className={styles.ageInput}
                            type="text"
                            onInput={handleAgeInput}
                            defaultValue={yield* this.age}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
