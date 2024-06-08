<script setup>
import {ref} from 'vue';

const props = defineProps(['displayedText'])
</script>

<template>
  <div class="input-display">
    {{ displayedText }}
  </div>
</template>

<style scoped>
.input-display {
  width: 100%;
  height: 40px; 
  margin: 2px; 
  text-align: center; 
  line-height: 40px; 
  background-color: rgb(210, 211, 205);
  border: 1px solid #818080;
}
</style>