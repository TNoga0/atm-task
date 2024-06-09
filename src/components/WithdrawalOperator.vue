<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref } from 'vue';

const store = useGeneralStore()
const returnObject = ref(createInitialReturnObject())

// Creates an initial object to be edited and returned when Promise is resolved or rejected.
function createInitialReturnObject() {
  return {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: store.getAccountBalance(),
    statusMessage: ''
  };
}

// Calculates the banknotes needed for payout.
function calculateBanknotesToPayOut(amountToWithdraw) {
  store.availableBanknotes.forEach(banknote => {
    returnObject.value.banknotesUsed[banknote] = 0;
    while (amountToWithdraw >= banknote) {
      returnObject.value.banknotesUsed[banknote] += 1;
      amountToWithdraw -= banknote;
    }
    if (returnObject.value.banknotesUsed[banknote] > 0) {
      returnObject.value.statusMessage += `${returnObject.value.banknotesUsed[banknote]}x${banknote}PLN `;
    }
  });
  return amountToWithdraw
}

// Performs the deposit action. Invoked from parent after clicking "Enter" in Withdraw mode.
const performWithdraw = (amount) => {
  const balance = store.getAccountBalance();
  var amountToWithdraw = parseInt(amount)
  // Asserted balance to be set after withdraw is complete
  var newBalance = balance - amountToWithdraw
  
  return new Promise((resolve, reject) => {
    if (balance < amountToWithdraw) {
      returnObject.value.statusMessage = 'Cannot withdraw. Account balance too low.'
      reject(returnObject.value);
      return;
    }
    amountToWithdraw = calculateBanknotesToPayOut(amountToWithdraw)
    if (amountToWithdraw === 0) {
      finalizeWithdrawal(newBalance)
    }
    else {
      rejectWithdrawal()
    }
    resolve(returnObject.value);
    })
}

function finalizeWithdrawal (temporaryBalance) {
  Object.assign(returnObject.value, {
    operationSuccessful: true,
    statusMessage: 'Operation successful. Banknotes to be collected: ' + returnObject.value.statusMessage.trim(),
    balanceLeft: temporaryBalance,
  })
  store.setAccountBalance(temporaryBalance);
}

const resetWithdrawalOperation = () => {
  returnObject.value = createInitialReturnObject();
}

const rejectWithdrawal = () => {
  Object.assign(returnObject.value, {
    banknotesUsed: {},
    statusMessage: 'Incorrect withdrawal value. No banknotes to satisfy this request.'
  })
  resetWithdrawalOperation();
}

defineExpose({performWithdraw})

</script>

<template>
  <div class="withdrawal-operator" display="none">
  </div>
</template>