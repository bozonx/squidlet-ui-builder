<script lang="ts">
  import type {CustomComponent} from '../interfaces/CustomComponent';

  export let item: CustomComponent
</script>

<div>
  <input value={item.name} />
  <textarea>{item.template}</textarea>
</div>
