<script setup>
import { useGeneralStore } from '@/stores/generalStore';
import { ref } from 'vue';

const store = useGeneralStore()

const banknotesUsed = ref({})

const performWithdraw = (amount) => {
  const balance = store.getAccountBalance();
  let amountToWithdraw = parseInt(amount)
  var temporaryBalance = balance - amountToWithdraw
  var returnObject = {
    operationSuccessful: false,
    banknotesUsed: {},
    balanceLeft: balance,
    statusMessage: ''
  }
  return new Promise((resolve, reject) => {
    if (balance < amountToWithdraw) {
      returnObject.statusMessage = 'Cannot withdraw. Account balance too low.'
      reject(returnObject);
      return;
    }
    store.availableBanknotes.forEach(banknote => {
      returnObject.banknotesUsed[banknote] = 0
      while(amountToWithdraw >= banknote) {
        returnObject.banknotesUsed[banknote] += 1;
        amountToWithdraw = amountToWithdraw - banknote;
      }
      if (returnObject.banknotesUsed[banknote] > 0) {
        returnObject.statusMessage += `${returnObject.banknotesUsed[banknote]}x${banknote}PLN `
      }
      
    })
    if (amountToWithdraw === 0) {
      returnObject.operationSuccessful = true;
      returnObject.statusMessage = 'Operation successful. Banknotes to be collected: ' + returnObject.statusMessage.trim();
      returnObject.balanceLeft = temporaryBalance;
      store.setAccountBalance(temporaryBalance);
    }
    else {
      returnObject.banknotesUsed = {}
      returnObject.statusMessage = 'Incorrect withdrawal value. No banknotes to satisfy this request.'
    }
    resolve(returnObject);
    })
}

defineExpose({performWithdraw})

</script>

<template>
  <div class="withdrawal-operator" display="none">
  </div>
</template>