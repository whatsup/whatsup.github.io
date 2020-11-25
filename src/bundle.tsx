import './root/reset.scss'
import { Root } from './root'
import { render } from '@fract/jsx'
import { Todos } from './root/todos'
import { Factors } from './root/factors'
import { Sierpinski } from './root/sierpinski'
import { Antistress } from './root/antistress'

render(new Root() as any, document.body!)
