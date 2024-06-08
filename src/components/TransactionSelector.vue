<script setup>
const emit = defineEmits(['transactionChosen'])

const handleTransactionChoice = (choice) => {
  emit('transactionChosen', choice)
}
</script>

<template>
  <div class="action-selector">
    <button @click="handleTransactionChoice('withdraw')">Withdraw</button>
    <button @click="handleTransactionChoice('deposit')">Deposit</button>
  </div>
</template>

<style scoped>
.action-selector {
  display: flex;
  justify-content: center;
}

button {
  width: 7rem;
  padding: 1rem;
  margin: 1rem;
}
</style>