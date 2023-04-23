<svelte:head>
  <title>Ui builder</title>
  <meta name="description" content="The UI for build apps for squidlet" />
</svelte:head>

<script lang="ts">
import MenuElementsRoot from "../../lib/components/MenuElementsRoot.svelte";
import type {ComponentsCollection} from '../../lib/interfaces/types'


const testComponents: ComponentsCollection = [
  {
    name: 'My component',
    type: 'CustomComponent',
    template: '<div>some content</div>',
  }
]

</script>

<div>
  <MenuElementsRoot components={testComponents} />
</div>
