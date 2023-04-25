<script lang="ts">
  import MenuItemComponent from "./MenuItemComponent.svelte";
  import type {MenuDir} from "../interfaces/MenuDir.js";


  export let item: MenuDir
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
