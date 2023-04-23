<svelte:head>
  <title>Ui builder</title>
  <meta name="description" content="The UI for build apps for squidlet" />
</svelte:head>

<script lang="ts">
import MenuElementsRoot from "../../lib/components/MenuElementsRoot.svelte";
import {testComponents} from '../../lib/testData';


</script>

<div>
  <MenuElementsRoot components={testComponents} />
</div>
