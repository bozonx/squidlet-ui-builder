<script lang="ts">
  import type {ComponentDir} from "../interfaces/ComponentDir.js";
  import MenuItemComponent from "./MenuItemComponent.svelte";


  export let item: ComponentDir
</script>

<div>
  <div>{item.name}</div>
  <ul>
    {#each item.children as child}
      <li>
        <MenuItemComponent item={child} />
      </li>
    {/each}
  </ul>
</div>
