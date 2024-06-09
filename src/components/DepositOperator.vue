<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref, computed } from 'vue';

const store = useGeneralStore()
const emit = defineEmits(['fixDeclaration', 'insertMore'])

// Indicates if the deposit process is still ongoing (will still be true if a correction is needed)
const depositStarted = ref(false)

const statusMessage = ref('')

const showBanknoteSimulator = computed(() => {
  return depositStarted.value && !returnObject.value.needDeclarationFix;
})

// Currently deposited money. Will be increased after "inserting" each banknote.
const currentDeposit = ref(0)
// Declared amount to be deposited. Checked against 'currentDeposit'
const amountToDeposit = ref(0)

// Creates an initial object to be edited and returned when Promise is resolved or rejected.
function createInitialReturnObject() {
  return {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: store.getAccountBalance(), // Account balance left after the operation
    needInsert: false, // Indicates that the amount inserted was lower than the declared.
    needDeclarationFix: false, // Indicates that the amount inserted was higher than the declared.
    statusMessage: ''
  }
}
const returnObject = ref(createInitialReturnObject())

// A state object to hold the resolve function of transaction promise. 
// Used to postpone the execution until banknotes have been inserted and identified.
const depositPromiseResolve = ref(null)

const resetDepositOperation = () => {
  currentDeposit.value = 0;
  amountToDeposit.value = 0;
  returnObject.value = createInitialReturnObject();
  depositStarted.value = false;
}

// Performs the deposit action. Invoked from parent after clicking "Enter" in Deposit mode.
const performDeposit = (amount) => {
  amountToDeposit.value = parseInt(amount)

  return new Promise((resolve, reject) => {
    // Conditional will be satisfied and used only if the user was prompted to insert more banknotes and the amount after adding them is correct.
    // A bit hacky, but works as intended.
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

// Fired after clicking (i.e. "inserting") a banknote 
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

// Called after the amount declared is equal to the sum inserted.
// Sets the new account balance and resolves the Promise.
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
  resetDepositOperation();
}

defineExpose({performDeposit, resetDeposit: resetDepositOperation})

</script>

<template>
  <div class="deposit-operator">
    <div v-show="showBanknoteSimulator">Banknote Inserting simulator</div>
    <div v-show="showBanknoteSimulator">Inserted: {{ currentDeposit }}</div>
    <div class="status-message-deposit">{{ statusMessage }}</div>
    <button v-show="showBanknoteSimulator" v-for="banknote in store.availableBanknotes" @click="addToDepositValue(banknote)">{{ banknote }} PLN</button>
    <button v-show="showBanknoteSimulator" @click="finishInsertingBanknotes">All banknotes inserted</button>
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