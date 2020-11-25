import styles from './friends.scss'
import { list, Fractal, List, Context } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { Loader } from 'loadable/loader'
import { Api } from 'loadable/api'
import { Friend, FriendLoader } from './friend'

export class Friends extends Fractal<JSX.Element> {
    list!: List<Friend>

    async loadFriendList() {
        if (!this.list) {
            this.list = list((await Api.loadFriendIds()).map((id) => new Friend(id)))
        }
    }

    *stream(ctx: Context) {
        this.loadFriendList().then(() => ctx.update())

        yield <FriendsLoader />

        while (true) {
            yield (
                <Container>
                    <FriendsTitle>My friends</FriendsTitle>
                    {yield* this.list.spread()}
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

function Container({ children }: FractalJSX.Attributes) {
    return <div className={styles.container}>{children}</div>
}

function FriendsTitle({ children }: FractalJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}
