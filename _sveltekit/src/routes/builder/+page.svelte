<svelte:head>
  <title>Ui builder</title>
  <meta name="description" content="The UI for build apps for squidlet" />
</svelte:head>

<script lang="ts">
import MenuScreensIndex from '../../lib/components/MenuScreensIndex.svelte';
import type {ScreensMenuFile} from '../../lib/interfaces/ScreensMenuFile';
import type {MenuDir} from '../../lib/interfaces/MenuDir';
import type {MenuElement} from '../../lib/interfaces/MenuElement';


export let data: {
  menuScreens: ScreensMenuFile[]
  menuComponents: MenuDir<MenuElement>
}
</script>

<div>
  <MenuScreensIndex items={data.menuScreens} />
</div>
