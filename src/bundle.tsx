import './root/reset.scss'
import { render } from '@fract/jsx'
import { Todos } from './root/todos'
import { Sierpinski } from './root/sierpinski'

render(new Sierpinski() as any, document.body!)
