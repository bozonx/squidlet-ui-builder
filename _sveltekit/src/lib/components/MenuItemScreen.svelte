<script lang="ts">
  import {SquidletFrontend} from '../../../../src/squidlet-frontend';
  import type {ScreensMenuFile} from '../interfaces/ScreensMenuFile';
  import type {Screen} from '../interfaces/Screen';

  export let item: ScreensMenuFile
  export let data: {
    screen: Screen
  }


  export async function load(params: {screenId: string}) {
    console.log(2222, params)
    //TODO: инстанс надо затулить в какой-то синглтон
    const squidletFronend = new SquidletFrontend()
    const screen = squidletFronend.userFiles.instantiateStringFile(`screens/${params.screenId}`)

    return {
      screen: screen.getJsonContent(),
    }
  }

  // TODO: on component init
  //load({screenId: item.screenId})

</script>

<div>
  <div>{data?.screen?.name}</div>
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
