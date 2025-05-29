import { makeComponent } from '@/translators/vue/makeComponent'
import { ComponentSchema } from '@/types/ComponentSchema'
import { describe, it, expect } from 'vitest'

describe('Translator Vue', () => {
  describe('component', () => {
    it('template component', () => {
      const schema: ComponentSchema = {
        template: [
          {
            type: 'Component',
            component: 'Button',
            props: {
              className: {
                type: 'string',
                value: 'button',
              },
            },
          },
        ],
      };

      const result = `<template>
<Button className="button"></Button>
</template>`;
      expect(makeComponent(schema)).toBe(result);
    });

    it('props', () => {
      const schema: ComponentSchema = {
        props: {
          className: {
            type: 'string',
            value: 'button',
          },
        },
      };

      const result =
        `<script setup>\n` +
        `const props = defineProps({\nclassName: String,\n})\n` +
        `</script>\n`;
      expect(makeComponent(schema)).toBe(result);
    });
  });
});

