<script setup>
const emit = defineEmits(['actionChosen'])

const handleActionChoose = (choice) => {
  emit('actionChosen', choice)
}
</script>

<template>
  <div class="action-selector">
    <button @click="handleActionChoose('withdraw')">Withdraw</button>
    <button @click="handleActionChoose('deposit')">Deposit</button>
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