<template>
  <div class="trpc-test">
    <h2>tRPC Test Component</h2>
    
    <div class="controls">
      <button @click="fetchGreeting" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Fetch Greeting' }}
      </button>
    </div>

    <div v-if="error" class="error">
      Error: {{ error.message }}
    </div>

    <div v-if="greeting" class="result">
      <h3>Server Response:</h3>
      <p>{{ greeting }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trpc } from '../trpc/client'

const greeting = ref(null)
const error = ref(null)
const isLoading = ref(false)

async function fetchGreeting() {
  try {
    isLoading.value = true
    error.value = null
    
    // Вызываем tRPC процедуру
    const result = await trpc.greeting.query()
    greeting.value = result
  } catch (e) {
    error.value = e
    console.error('tRPC error:', e)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.trpc-test {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.controls {
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  padding: 10px;
  border: 1px solid #ff4444;
  border-radius: 4px;
  margin: 10px 0;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.result h3 {
  margin-top: 0;
  color: #2c3e50;
}
</style> 