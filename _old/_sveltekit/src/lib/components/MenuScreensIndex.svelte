<script lang="ts">
  import MenuItemScreen from './MenuItemScreen.svelte';
  import type {ScreensMenuFile} from '../interfaces/ScreensMenuFile';


  export let items: ScreensMenuFile[] = []
</script>

<div>
  <div>
    <div>Screens</div>
    <ul>
      {#each items as item}
        <li>
          <MenuItemScreen item={item} />
        </li>
      {/each}
    </ul>
  </div>

</div>
