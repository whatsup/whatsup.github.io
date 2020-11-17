import styles from './groups.scss'
import { tmp, list, Emitter, List } from '@fract/core'
import { Api } from 'loadable/api'
import { Group, GroupLoader } from './group'

export class Groups extends Emitter<JSX.Element> {
    list!: List<Group>

    async loadGroupList() {
        if (!this.list) {
            this.list = list((await Api.loadGroupIds()).map((id) => new Group(id)))
        }
    }

    async *collector() {
        yield tmp(<GroupsLoader />)

        await this.loadGroupList()

        while (true) {
            yield <Container>{yield* this.list}</Container>
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

type Props = { children: any }

function Container({ children }: Props) {
    return <div className={styles.container}>{children}</div>
}
