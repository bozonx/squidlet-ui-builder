<script lang="ts">
  import MenuItemComponent from "./MenuItemComponent.svelte";
  import MenuItemDir from "./MenuItemDir.svelte";
  import MenuItemScreen from './MenuItemScreen.svelte';
  import type {ComponentsCollection} from "../interfaces/types.js";
  import type {Screen} from "../interfaces/Screen.js";


  export let screens: Screen[] = []
  export let components: ComponentsCollection = []
</script>

<div>
  <div>
    <div>Screens</div>
    <ul>
      {#each screens as item}
        <li>
          <MenuItemScreen item={item} />
        </li>
      {/each}
    </ul>
  </div>

  <div>
    <div>Components</div>
    <ul>
      {#each components as item}
        {#if item.type === 'CustomComponent'}
          <li>
            <MenuItemComponent item={item} />
          </li>
        {:else if item.type === 'ComponentDir'}
          <li>
            <MenuItemDir item={item} />
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</div>
