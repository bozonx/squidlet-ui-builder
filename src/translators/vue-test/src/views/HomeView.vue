<template>
  <div class="home">
    <h1>Welcome to Vue Translator</h1>
    <p>This is a modern Vue.js application built with Vite</p>
    
    <TrpcTest />
  </div>
</template>

<script setup>
import TrpcTest from '../components/TrpcTest.vue'
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  color: #42b983;
  margin-bottom: 20px;
}
</style> 