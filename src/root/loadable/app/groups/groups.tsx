import styles from './groups.scss'
import { list, Fractal, List, Context } from '@fract/core'
import { Api } from 'loadable/api'
import { Group, GroupLoader } from './group'
import { FractalJSX } from '@fract/jsx'

export class Groups extends Fractal<JSX.Element> {
    list!: List<Group>

    async loadGroupList() {
        if (!this.list) {
            this.list = list((await Api.loadGroupIds()).map((id) => new Group(id)))
        }
    }

    *stream(ctx: Context) {
        this.loadGroupList().then(() => ctx.update())

        yield <GroupsLoader />

        while (true) {
            yield <Container>{yield* this.list.spread()}</Container>
        }
    }
}

function GroupsLoader() {
    return (
        <Container>
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
            <GroupLoader />
        </Container>
    )
}

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}
