import styles from './app.scss'
import { fractal, Emitter } from '@fract/core'
import { MODE, Mode } from './factors'
import { User } from './user'

export class App extends Emitter<JSX.Element> {
    readonly user = new User('John', 33)

    async *collector() {
        const User = this.user

        const Edit = fractal(async function* (ctx) {
            ctx!.set(MODE, Mode.Edit)
            return User
        })

        const View = fractal(async function* (ctx) {
            ctx!.set(MODE, Mode.View)
            return User
        })

        const Json = fractal(async function* (ctx) {
            ctx!.set(MODE, Mode.Json)
            return User
        })

        while (true) {
            yield (
                <section className={styles.container}>
                    <header className={styles.title}>Factors of work</header>
                    <div className={styles.flex}>
                        <div className={styles.box}>
                            <div className={styles.subTitle}>User as Edit</div>
                            {yield* Edit}
                        </div>
                        <div className={styles.box}>
                            <div className={styles.subTitle}>User as View</div>
                            {yield* View}
                        </div>
                        <div className={styles.box}>
                            <div className={styles.subTitle}>User as Json</div>
                            {yield* Json}
                        </div>
                    </div>
                </section>
            )
        }
    }
}
