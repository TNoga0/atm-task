<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { defineProps, ref } from 'vue';

const store = useGeneralStore()
const emit = defineEmits(['fixDeclaration', 'insertMore'])

const banknotesUsed = ref({})
const depositStarted = ref(false)

const statusMessage = ref('')
const currentDeposit = ref(0)
const amountToDeposit = ref(0)
const returnObject = ref({
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: store.getAccountBalance(),
    needInsert: false,
    needDeclarationFix: false,
    statusMessage: ''
  })

const depositPromiseResolve = ref(null)

const performDeposit = (amount) => {
  amountToDeposit.value = parseInt(amount)

  return new Promise((resolve, reject) => {
    if (amountToDeposit.value === currentDeposit.value) {
      finishInsertingBanknotes();
    }
    depositPromiseResolve.value = resolve;
    if (!(amountToDeposit.value % 10 === 0)) {
    returnObject.value.statusMessage = 'Incorrect deposit value. No banknotes to satisfy this request.'
    reject(returnObject.value);
    }
    depositStarted.value = true;
  })
}

const addToDepositValue = (amount) => {
  currentDeposit.value += amount;
  returnObject.value.banknotesUsed[amount] = (returnObject.value.banknotesUsed[amount] || 0) + 1;
}

const finishInsertingBanknotes = () => {
  if (currentDeposit.value == amountToDeposit.value) {
    store.setAccountBalance(store.getAccountBalance() + amountToDeposit.value);
    console.log(store.getAccountBalance());
    returnObject.value.operationSuccessful = true;
    returnObject.value.statusMessage = 'Deposit successful';
    returnObject.value.balanceLeft = store.getAccountBalance();
    depositPromiseResolve.value(returnObject.value);
    depositStarted.value = false;
  }
  else if (currentDeposit.value < amountToDeposit.value) {
    returnObject.value.needInsert = true;
    emit('insertMore', `Amount inserted lower than declared ${amountToDeposit.value}. Insert more or cancel.`)
  }
  else if (currentDeposit.value > amountToDeposit.value) {
    returnObject.value.needDeclarationFix = true;
    emit('fixDeclaration', `Amount inserted ${currentDeposit.value} higher than declared ${amountToDeposit.value}. Change the declaration and press Enter or cancel.`);

  }
}

defineExpose({performDeposit})

</script>

<template>
  <div class="deposit-operator">
    <div v-show="depositStarted">Banknote Inserting simulator</div>
    <div v-show="depositStarted">Inserted: {{ currentDeposit }}</div>
    <div class="status-message-deposit">{{ statusMessage }}</div>
    <button v-show="depositStarted" v-for="banknote in store.availableBanknotes" @click="addToDepositValue(banknote)">{{ banknote }} PLN</button>
    <button v-show="depositStarted" @click="finishInsertingBanknotes">All banknotes inserted</button>
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