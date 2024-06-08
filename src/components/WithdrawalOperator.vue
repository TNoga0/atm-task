<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref } from 'vue';

const store = useGeneralStore()
const returnObject = ref(createInitialReturnObject())


function createInitialReturnObject() {
  return {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: store.getAccountBalance(),
    statusMessage: ''
  };
}

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

const performWithdraw = (amount) => {
  const balance = store.getAccountBalance();
  let amountToWithdraw = parseInt(amount)
  var temporaryBalance = balance - amountToWithdraw
  
  return new Promise((resolve, reject) => {
    if (balance < amountToWithdraw) {
      returnObject.value.statusMessage = 'Cannot withdraw. Account balance too low.'
      reject(returnObject.value);
      return;
    }
    amountToWithdraw = calculateBanknotesToPayOut(amountToWithdraw)
    if (amountToWithdraw === 0) {
      finalizeWithdrawal(temporaryBalance)
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

const rejectWithdrawal = () => {
  Object.assign(returnObject.value, {
    banknotesUsed: {},
    statusMessage: 'Incorrect withdrawal value. No banknotes to satisfy this request.'
  })
}

defineExpose({performWithdraw})

</script>

<template>
  <div class="withdrawal-operator" display="none">
  </div>
</template>