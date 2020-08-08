export const STORE_KEY = 'ANTISTRESS_STORE'
export const IS_TOUCH = 'ontouchstart' in document.documentElement

export enum Color {
    None = 'unset',
    Default = '#00bcd4',
    Red = '#e91e63',
    Pink = '#9c27b0',
    Blue = '#2196f3',
    Cyan = '#00bcd4',
    Green = '#4caf50',
    Lime = '#cddc39',
    Amber = '#ffc107',
}

export const Palette = [Color.Red, Color.Pink, Color.Blue, Color.Cyan, Color.Green, Color.Lime, Color.Amber]
