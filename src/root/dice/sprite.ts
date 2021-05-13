import { conse, Conse, Fractal, list, List, Mutator, whatsUp } from 'whatsup'
import dice from './dice.png'

class Paint {
    static fromImage(x: number, y: number, image: HTMLImageElement) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        ctx.drawImage(image, 0, 0)

        return new this(x, y, image.naturalWidth, image.naturalHeight, canvas)
    }

    readonly canvas2Dctx: CanvasRenderingContext2D

    constructor(
        readonly x: number,
        readonly y: number,
        readonly w: number,
        readonly h: number,
        readonly canvas = document.createElement('canvas')
    ) {
        if (this.canvas.width != w) this.canvas.width = w
        if (this.canvas.height != h) this.canvas.height = h
        this.canvas2Dctx = canvas.getContext('2d')!
    }
}

class Painter extends Mutator<Paint> {
    constructor(
        readonly x: number,
        readonly y: number,
        readonly w: number,
        readonly h: number,
        readonly children: Paint[]
    ) {
        super()
    }

    mutate({ canvas, canvas2Dctx } = new Paint(this.x, this.y, this.w, this.h)) {
        canvas.width = this.w
        canvas.height = this.h

        // canvas2Dctx.save()
        // canvas2Dctx.setTransform(1, 0, 0, 1, 0, 0)
        // canvas2Dctx.clearRect(0, 0, this.w, this.h)
        // canvas2Dctx.restore()

        for (const child of this.children) {
            canvas2Dctx.drawImage(child.canvas, child.x, child.y)
        }

        return new Paint(this.x, this.y, this.w, this.h, canvas)
    }
}

abstract class Entity extends Fractal<Paint> {
    readonly x: Conse<number>
    readonly y: Conse<number>
    readonly w: Conse<number>
    readonly h: Conse<number>

    constructor() {
        super()
        this.x = conse(0)
        this.y = conse(0)
        this.w = conse(0)
        this.h = conse(0)
    }
}

class Actor extends Entity {
    readonly children: List<Entity>

    constructor() {
        super()
        this.children = list()
    }

    *whatsUp() {
        while (true) {
            const x = yield* this.x
            const y = yield* this.y
            const w = yield* this.w
            const h = yield* this.h
            const children = [] as Paint[]

            for (const child of yield* this.children) {
                children.push(yield* child)
            }

            yield new Painter(x, y, w, h, children)
        }
    }
}

class Sprite extends Entity {
    constructor(readonly image: HTMLImageElement) {
        super()
    }

    *whatsUp() {
        while (true) {
            const x = yield* this.x
            const y = yield* this.y

            yield Paint.fromImage(x, y, this.image)
        }
    }
}

const s1 =
    'A4kFoQhfgdg2hLQhFhfAAiiQAAidA5haQAuhJBbggQBEgZBhAAQCbAABVA8QBIAyAdBfQAVBFAABoQAADOhuBeQhbBPifAAIAAAAQhSAAg9gTgA4ojAQg1BBAAB+QAAB2AcA3QAuBWB9AAQBuAAAwhHQApg+AAh8QAAiOg5g/QgwgzheAAIAAAAQhdAAg1A/gAqNFzQjWAAhChpQghgzAAh0IAAnOICSAAIAAG0IAAAiQAABAAZAjQAnA1BnAAQBcAAAjgpQAkgpAAhoIAAm0ICTAAIAAG4IAAAkQAABsgtA5QhJBdjAAAIAAAAgEAkdAFrIAAh/ICTAAIAAB/gAfTFrIk5onIAAInIiTAAIAArWIC/AAIEqIKIAAoKICQAAIAALWgATQFrIAArWICcAAIAALWgALyFrIiZocIgEAAIiIIcIi1AAIjvrWICdAAICmIvIAEAAICNovICxAAIClI2ICco2ICXAAIjdLWgEgieAFrIgClBIkPmVICnAAICyEXIC1kXICsAAIkTGVIAAFBgEAkdACvIAAoaICTAAIAAIag'
const img = new Image()

img.src = require('./dice.png').default

img.onload = () => {
    const sprite1 = new Sprite(img)
    const sprite2 = new Sprite(img)
    const actor = new Actor()
    const scene = new Actor()

    sprite2.x.set(200)

    actor.w.set(400)
    actor.h.set(400)

    scene.w.set(600)
    scene.h.set(600)

    actor.children.insert(sprite1, sprite2)
    scene.children.insert(actor)

    window.a = actor
    window.s1 = sprite1
    window.s2 = sprite2

    whatsUp(
        scene,
        (paint) => {
            console.log(paint)
            document.body.append(paint.canvas)
        },
        (e) => console.error(e)
    )
}
