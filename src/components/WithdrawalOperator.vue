<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref } from 'vue';
import {createInitialReturnObject} from '@/utils.js';

const store = useGeneralStore();
const returnObject = ref(createInitialReturnObject());

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
  let amountToWithdraw = parseInt(amount);
  // Asserted balance to be set after withdraw is complete
  let newBalance = balance - amountToWithdraw;
  
  return new Promise((resolve, reject) => {
    returnObject.value.statusMessage = '';
    if (amountToWithdraw === 0) {
      returnObject.value.statusMessage = 'Cannot withdraw 0.'
      reject(returnObject.value);
      return;
    }
    if (balance < amountToWithdraw) {
      returnObject.value.statusMessage = 'Cannot withdraw. Account balance too low.'
      reject(returnObject.value);
      return;
    }
    amountToWithdraw = calculateBanknotesToPayOut(amountToWithdraw)
    if (amountToWithdraw === 0) {
      finalizeWithdrawal(newBalance);
    }
    else {
      rejectWithdrawal();
    }
    resolve(returnObject.value);
    resetWithdrawalOperation();
    })
}

function finalizeWithdrawal (newBalance) {
  Object.assign(returnObject.value, {
    operationSuccessful: true,
    statusMessage: 'Operation successful. Banknotes to be collected: ' + returnObject.value.statusMessage.trim(),
    balanceLeft: newBalance,
  });
  store.setAccountBalance(newBalance);
}

const resetWithdrawalOperation = () => {
  returnObject.value = createInitialReturnObject();
}

const rejectWithdrawal = () => {
  Object.assign(returnObject.value, {
    banknotesUsed: {},
    statusMessage: 'Incorrect withdrawal value. No banknotes to satisfy this request. Correct the value or cancel.'
  });
  // resetWithdrawalOperation();
}

defineExpose({performWithdraw})

</script>

<template>
  <div class="withdrawal-operator" display="none">
  </div>
</template>