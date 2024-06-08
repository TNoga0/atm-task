<script setup>
const props = defineProps(['statusMessage'])
const emit = defineEmits(['confirm'])
</script>

<template>
  <div class="transaction-status">
    <h2 class="status-message" v-show="statusMessage"> {{ statusMessage }} </h2>
    <button v-show="statusMessage" class="confirm-operation-result" @click="emit('confirm')">OK</button>
  </div>
</template>

<style scoped>
.status-message {
  max-width: 50vw;
  text-align: center;
}

.confirm-operation-result {
  width: 5rem;
  justify-self: center;
  padding: 0.5rem;
}

.transaction-status {
  align-items: center;
  display: grid;
}
</style>