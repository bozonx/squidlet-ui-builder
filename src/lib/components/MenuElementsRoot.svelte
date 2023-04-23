<script lang="ts">
  import MenuItemComponent from "./MenuItemComponent.svelte";
  import {ComponentsCollection} from "../interfaces/types.js";
  import MenuItemDir from "./MenuItemDir.svelte";


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
