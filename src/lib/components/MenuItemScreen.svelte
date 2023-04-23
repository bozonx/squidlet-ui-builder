<script lang="ts">
  import {ScreensMenuFile} from '../interfaces/ScreensMenuFile';

  export let item: ScreensMenuFile

  // TODO: load file
</script>

<div>
  <div>{item.name}</div>
  {#if item.children?.length}
    <ul>
      {#each item.children as child}
        <li>
          <svelte:self item={child} />
        </li>
      {/each}
    </ul>
  {/if}
</div>
