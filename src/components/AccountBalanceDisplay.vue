<script setup>
const props = defineProps(['displayedBalance'])
</script>

<template>
  <h2 class="balance-display">
    Account balance: {{ displayedBalance > 0 ? displayedBalance : 0 }} PLN
  </h2>
</template>

<style scoped>
.balance-display {
  height: 40px; 
  margin: 2px; 
  text-align: center; 
  line-height: 40px;
}
</style>