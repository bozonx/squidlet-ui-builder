import type {ComponentDir} from './ComponentDir';
import type {CustomComponent} from './CustomComponent';


export type ComponentsCollection = (CustomComponent | ComponentDir)[]
export type ComponentType = 'CustomComponent' | 'ComponentDir'
