<script lang="ts">
  import type {Library} from '../interfaces/Library';
  import MenuComponentTree from './MenuComponentTree.svelte';


  export let item: Library
</script>

<div>
  <div>{item.name}</div>
  <ul>
    {#each item.elements as el}
      <li>
        <MenuComponentTree item={el} />
      </li>
    {/each}
  </ul>
</div>
