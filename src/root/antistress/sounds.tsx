function playSound(name: string) {
    const audio = new Audio()
    const ext = ['probably', 'maybe'].includes(audio.canPlayType('audio/mpeg')) ? 'mp3' : 'ogg'
    const src = require(`./sounds/${name}.${ext}`).default
    audio.preload = 'auto'
    audio.src = src
    audio.play()
}

export function playFillSound() {
    playSound('fill')
}

export function playSplitSound() {
    playSound('split')
}
