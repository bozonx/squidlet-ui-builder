<svelte:head>
  <title>Ui builder</title>
  <meta name="description" content="The UI for build apps for squidlet" />
</svelte:head>

<script>
import MenuElementsRoot from "../../lib/components/MenuElementsRoot.svelte";


const testComponents = [
  {
    name: 'My component',
    template: '<div>some content</div>',
  }
]

</script>

<div>
  <MenuElementsRoot components={testComponents} />
</div>
