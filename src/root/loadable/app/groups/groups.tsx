import styles from './groups.scss'
import { list, Fractal, List, Context } from 'whatsup'
import { Api } from 'loadable/api'
import { Group, GroupLoader } from './group'
import { WhatsJSX } from '@whatsup/jsx'
import { connect } from 'loadable/utils'

export class Groups extends Fractal<JSX.Element> {
    list!: List<Group>

    async loadGroupList() {
        if (!this.list) {
            this.list = list((await Api.loadGroupIds()).map((id) => new Group(id)))
        }
    }

    *whatsUp(ctx: Context) {
        ctx.defer(() => this.loadGroupList())

        yield <GroupsLoader />

        while (true) {
            yield <Container>{yield* connect(this.list)}</Container>
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

function Container({ children }: WhatsJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}
