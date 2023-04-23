<script lang="ts">
  import type {Screen} from '../interfaces/Screen';

  export let item: Screen
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
