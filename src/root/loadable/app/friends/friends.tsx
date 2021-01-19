import styles from './friends.scss'
import { list, Fractal, List, Context } from 'whatsup'
import { WhatsJSX } from '@whatsup/jsx'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { Friend, FriendLoader } from './friend'
import { connect } from 'loadable/utils'

export class Friends extends Fractal<JSX.Element> {
    list!: List<Friend>

    async loadFriendList() {
        if (!this.list) {
            this.list = list((await Api.loadFriendIds()).map((id) => new Friend(id)))
        }
    }

    *whatsUp(ctx: Context) {
        ctx.defer(() => this.loadFriendList())

        yield <FriendsLoader />

        while (true) {
            yield (
                <Container>
                    <FriendsTitle>My friends</FriendsTitle>
                    {yield* connect(this.list)}
                </Container>
            )
        }
    }
}

function FriendsLoader() {
    return (
        <Container>
            <FriendsTitle>
                <Loader h={26} />
            </FriendsTitle>
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
            <FriendLoader />
        </Container>
    )
}

function Container({ children }: WhatsJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

function FriendsTitle({ children }: WhatsJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}
