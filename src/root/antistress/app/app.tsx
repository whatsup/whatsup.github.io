import styles from './app.scss'
import { fraction, Fractal, Fraction, Context } from '@fract/core'
import { FractalJSX } from '@fract/jsx'
import { Color, Palette } from '../const'
import { CURRENT_COLOR, MODE, Mode } from '../factors'
import { LayerData, Layer } from './layer'

export type AppData = {
    currentColor: Color
    layer: LayerData
}

export class App extends Fractal<any> {
    readonly currentColor: Fraction<Color>
    readonly layer: Layer

    constructor({ currentColor = Color.Default, layer = Color.Default }: AppData) {
        super()
        this.currentColor = fraction(currentColor)
        this.layer = new Layer(layer)
    }

    stream(ctx: Context) {
        switch (ctx.get(MODE)) {
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
    ctx.set(CURRENT_COLOR, this.currentColor)

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

function Container({ children }: FractalJSX.Attributes) {
    return <section className={styles.container}>{children}</section>
}

function Main({ children }: FractalJSX.Attributes) {
    return <main className={styles.main}>{children}</main>
}

function Help({ children }: FractalJSX.Attributes) {
    return <div className={styles.help}>{children}</div>
}

function Title({ children }: FractalJSX.Attributes) {
    return <div className={styles.title}>{children}</div>
}

function Tools({ children }: FractalJSX.Attributes) {
    return <div className={styles.tools}>{children}</div>
}

function Canvas({ children }: FractalJSX.Attributes) {
    return <div className={styles.canvas}>{children}</div>
}

export type ColorBtnProps = FractalJSX.Attributes & {
    color: string
    selected: boolean
    onClick: (event: FractalJSX.MouseEvent<HTMLDivElement>) => void
}

function ColorBtn({ color, selected, onClick }: ColorBtnProps) {
    let className = `${styles.colorBtn} ${styles[color]}`

    if (selected) {
        className += ` ${styles.selected}`
    }

    return <div className={className} onClick={onClick} />
}
