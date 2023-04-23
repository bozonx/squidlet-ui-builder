<script lang="ts">
  import MenuItemComponent from "./MenuItemComponent.svelte";
  import MenuItemDir from './MenuItemDir.svelte';
  import type {ComponentsCollection} from '../interfaces/types';
  import type {MenuDir} from "../interfaces/MenuDir.js";
  import {CustomComponent} from '../interfaces/CustomComponent';


  export let item: CustomComponent | MenuDir
</script>

<div>
  <div>{item.name}</div>
  <ul>
    {#each item.children as item}
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
