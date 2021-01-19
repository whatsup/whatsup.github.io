import styles from './app.scss'
import { Fractal, Context, Conse, conse } from 'whatsup'
import { WhatsJSX } from '@whatsup/jsx'
import { Color, Palette } from '../const'
import { CURRENT_COLOR, MODE, Mode } from '../factors'
import { LayerData, Layer } from './layer'

export type AppData = {
    currentColor: Color
    layer: LayerData
}

export class App extends Fractal<any> {
    readonly currentColor: Conse<Color>
    readonly layer: Layer

    constructor({ currentColor = Color.Default, layer = Color.Default }: AppData) {
        super()
        this.currentColor = conse(currentColor)
        this.layer = new Layer(layer)
    }

    whatsUp(ctx: Context) {
        switch (ctx.find(MODE)) {
            case Mode.Data:
                return workInDataMode.call(this)

            case Mode.Jsx:
                return workInJsxMode.call(this, ctx)
        }

        throw 'Unknown MODE'
    }
}

function* workInDataMode(this: App) {
    while (true) {
        yield {
            currentColor: yield* this.currentColor,
            layer: yield* this.layer,
        }
    }
}

function* workInJsxMode(this: App, ctx: Context) {
    ctx.define(CURRENT_COLOR, this.currentColor)

    while (true) {
        const currentColor = yield* this.currentColor

        yield (
            <Container>
                <Main>
                    <Title>antistress</Title>
                    <Canvas>{yield* this.layer}</Canvas>
                    <Tools>
                        {Palette.map((color) => (
                            <ColorBtn
                                key={color}
                                color={color}
                                selected={color === currentColor}
                                onClick={() => this.currentColor.set(color)}
                            />
                        ))}
                    </Tools>
                </Main>
                <Help>Click to fill, long click to split</Help>
            </Container>
        )
    }
}

function Container({ children }: WhatsJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Main({ children }: WhatsJSX.Attributes) {
    return <main className={styles.main}>{children}</main>
}

function Help({ children }: WhatsJSX.Attributes) {
    return <div className={styles.help}>{children}</div>
}

function Title({ children }: WhatsJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}

function Tools({ children }: WhatsJSX.Attributes) {
    return <div className={styles.tools}>{children}</div>
}

function Canvas({ children }: WhatsJSX.Attributes) {
    return <div className={styles.canvas}>{children}</div>
}

export type ColorBtnProps = WhatsJSX.Attributes & {
    color: string
    selected: boolean
    onClick: (event: WhatsJSX.MouseEvent<HTMLDivElement>) => void
}

function ColorBtn({ color, selected, onClick }: ColorBtnProps) {
    let className = `${styles.colorBtn} ${styles[color]}`

    if (selected) {
        className += ` ${styles.selected}`
    }

    return <div className={className} onClick={onClick} />
}
