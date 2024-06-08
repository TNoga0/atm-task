<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { defineProps, ref } from 'vue';

const store = useGeneralStore()
const emit = defineEmits(['fixDeclaration', 'insertMore'])

const depositStarted = ref(false)

const statusMessage = ref('')
const currentDeposit = ref(0)
const amountToDeposit = ref(0)

function createDefaultReturnObject() {
  return {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: store.getAccountBalance(),
    needInsert: false,
    needDeclarationFix: false,
    statusMessage: ''
  }
}

const returnObject = ref(createDefaultReturnObject())

const depositPromiseResolve = ref(null)

const resetDeposit = () => {
  currentDeposit.value = 0;
  amountToDeposit.value = 0;
  returnObject.value = createDefaultReturnObject();
  depositStarted.value = false;
}

const performDeposit = (amount) => {
  amountToDeposit.value = parseInt(amount)

  return new Promise((resolve, reject) => {
    if (amountToDeposit.value === currentDeposit.value) {
      finishInsertingBanknotes();
      return;
    }
    if (!(amountToDeposit.value % 10 === 0)) {
      returnObject.value.statusMessage = 'Incorrect deposit value. No banknotes to satisfy this request.'
      reject(returnObject.value);
    }
    else {
      depositStarted.value = true;
      depositPromiseResolve.value = resolve;
    }
  });
}

const addToDepositValue = (amount) => {
  currentDeposit.value += amount;
  returnObject.value.banknotesUsed[amount] = (returnObject.value.banknotesUsed[amount] || 0) + 1;
}

const finishInsertingBanknotes = () => {
  if (currentDeposit.value == amountToDeposit.value) {
    finalizeDeposit();
  }
  else if (currentDeposit.value < amountToDeposit.value) {
    requestMoreBanknotes();
  }
  else if (currentDeposit.value > amountToDeposit.value) {
    requestFixDeclaration();
  }
}

const requestMoreBanknotes = () => {
  Object.assign(returnObject.value, {
    needInsert: true,
    operationSuccessful: false,
    statusMessage: `Amount inserted lower than declared ${amountToDeposit.value}. Insert more or press Cancel to cancel operation.`
  })
  emit('insertMore', returnObject.value.statusMessage)
}

const requestFixDeclaration = () => {
  Object.assign(returnObject.value, {
    needDeclarationFix: true,
    operationSuccessful: false,
    statusMessage: `Amount inserted ${currentDeposit.value} higher than declared ${amountToDeposit.value}. Change the declaration and press Enter or press Cancel to cancel operation.`
  })
  emit('fixDeclaration', returnObject.value.statusMessage);
}

const finalizeDeposit = () => {
  store.setAccountBalance(store.getAccountBalance() + amountToDeposit.value);
  Object.assign(returnObject.value, {
    operationSuccessful: true,
    needInsert: false,
    needDeclarationFix: false,
    statusMessage: 'Deposit successful',
    balanceLeft: store.getAccountBalance()
  });
  depositPromiseResolve.value(returnObject.value);
  resetDeposit();
}

defineExpose({performDeposit, resetDeposit})

</script>

<template>
  <div class="deposit-operator">
    <div v-show="depositStarted && !returnObject.needDeclarationFix">Banknote Inserting simulator</div>
    <div v-show="depositStarted && !returnObject.needDeclarationFix">Inserted: {{ currentDeposit }}</div>
    <div class="status-message-deposit">{{ statusMessage }}</div>
    <button v-show="depositStarted && !returnObject.needDeclarationFix" v-for="banknote in store.availableBanknotes" @click="addToDepositValue(banknote)">{{ banknote }} PLN</button>
    <button v-show="depositStarted && !returnObject.needDeclarationFix" @click="finishInsertingBanknotes">All banknotes inserted</button>
  </div>
</template>

<style scoped>
.deposit-operator {
  margin-top: 20px;
}

button {
  display: block;
  margin-bottom: 5px;
}
</style>