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
        `</script>`;
      expect(makeComponent(schema)).toBe(result);
    });
  });

  it('handlers', () => {
    const schema: ComponentSchema = {
      handlers: {
        addElement: '(e) => {console.log("addElement");}',
      },
    };

    const result = `<script setup>\nconst addElement = (e) => {console.log("addElement");};</script>`;
    expect(makeComponent(schema)).toBe(result);
  });

  it('style', () => {
    const schema: ComponentSchema = {
      style: 'body { background-color: red; }',
    };
    const result = `<style>\nbody { background-color: red; }\n</style>`;
    
    expect(makeComponent(schema)).toBe(result);
  });

  it('styleScoped', () => {
    const schema: ComponentSchema = {
      styleScoped: 'body { background-color: red; }',
    };
    const result = `<style scoped>\nbody { background-color: red; }\n</style>`;
    
    expect(makeComponent(schema)).toBe(result);
  });
});

