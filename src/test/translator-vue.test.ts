import { makeComponent } from '@/translators/vue/makeComponent'
import { ComponentSchema } from '@/types/ComponentSchema'
import { describe, it, expect } from 'vitest'

describe('Translator Vue', () => {
  describe('makeComponent', () => {
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
<Button className="button">
</Button>
</template>`;
      expect(makeComponent(schema)).toBe(result);
    });
  });

  it('template element and text', () => {
    const schema: ComponentSchema = {
      template: [
        {
          type: 'Element',
          tag: 'div',
          props: {
            class: {
              type: 'string',
              value: 'some-class',
            },
          },
          children: [
            {
              type: 'Text',
              text: 'Hello',
            },
          ],
        },
      ],
    };

    const result = `<template>
<div class="some-class">\nHello\n</div>
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

