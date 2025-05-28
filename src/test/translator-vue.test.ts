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
        template: [
          {
            type: 'Component',
            component: 'Button',
            props: {
              class: 'button'
            },
            children: []
          }

        ]
      }

      const result = `<template>
<Button class="button">
</Button>
</template>`
      expect(makeComponent(schema)).toBe(result)
    })

  })

}) 