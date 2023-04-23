<svelte:head>
  <title>Ui builder</title>
  <meta name="description" content="The UI for build apps for squidlet" />
</svelte:head>

<script lang="ts">
import MenuElementsRoot from "../../lib/components/MenuElementsRoot.svelte";
import {screens, testCommonElements, testComponents, testLibs} from '../../lib/testData';


</script>

<div>
  <MenuElementsRoot
      screens={screens}
      components={testComponents}
      commonElements={testCommonElements}
      libs={testLibs}
  />
</div>
