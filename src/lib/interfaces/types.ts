import type {MenuDir} from './MenuDir';
import type {CustomComponent} from './CustomComponent';


export type ComponentsCollection = (CustomComponent | MenuDir)[]
export type ComponentType = 'CustomComponent' | 'ComponentDir'
