<script>
  import MenuItemComponent from "./MenuItemComponent.svelte";

  export let components = []

</script>

<div>
  gggg
  {#each components as item}
    <MenuItemComponent item={item} />
  {/each}
</div>
