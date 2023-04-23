<script lang="ts">
  import MenuItemComponent from "./MenuItemComponent.svelte";
  import MenuItemDir from "./MenuItemDir.svelte";
  import type {ComponentsCollection} from "../interfaces/types.js";


  export let components: ComponentsCollection = []

</script>

<div>
  <div>Components</div>
  {#each components as item}
    {#if item.type === 'CustomComponent'}
      <MenuItemComponent item={item} />
    {:else if item.type === 'ComponentDir'}
      <MenuItemDir item={item} />
    {/if}
  {/each}
</div>
