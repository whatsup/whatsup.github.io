import { fractal, cause, conse, Fractal, Context } from 'whatsup'
import { _Dice } from '../dice'
import { Game } from '../game'

export class Panel extends Fractal<JSX.Element> {
    *whatsUp(ctx: Context) {
        const game = ctx.get(Game)
        const playersCount = game.players.length

        while (true) {
            yield (
                <_Panel>
                    {Array.from({ length: playersCount }, (_, i) => (
                        <_Dice number={i as 1 | 2 | 3 | 4 | 5 | 6} />
                    ))}
                </_Panel>
            )
        }
    }
}

interface _PanelProps extends JSX.IntrinsicAttributes {}

function _Panel({ children }: _PanelProps) {
    return <div>{children}</div>
}
