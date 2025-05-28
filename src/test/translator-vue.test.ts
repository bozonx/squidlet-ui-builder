import { makeComponent } from '@/translators/vue/makeComponent'
import { ComponentSchema } from '@/types/ComponentSchema'
import { describe, it, expect } from 'vitest'

describe('Translator Vue', () => {
  describe('makeComponent', () => {
    it('should convert kebab-case to camelCase', () => {
      const schema: ComponentSchema = {
        props: {
          name: 'hello-world'
        },
        template: []
      }

      const result = `
      <template>
        <div>
          <h1>Hello World</h1>
        </div>
      </template>
      `
      expect(makeComponent(schema)).toBe(result)
    })

  })

}) 