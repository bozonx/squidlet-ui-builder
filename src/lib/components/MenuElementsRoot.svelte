<script>
  import MenuItemComponent from "./MenuItemComponent.svelte";

  const testComponents = [
    {
      name: 'My component',
      template: '<div>some content</div>',
    }
  ]

</script>

<div>
  gggg
  {#each testComponents as item}
    <MenuItemComponent item={item} />
  {/each}
</div>
