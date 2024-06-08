<script setup>
import { ref } from 'vue';
import UserInput from '@/components/UserInput.vue';
import AccountBalanceDisplay from '@/components/AccountBalanceDisplay.vue'
import TransactionSelector from '@/components/TransactionSelector.vue'
import WithdrawalOperator from '@/components/WithdrawalOperator.vue'
import DepositOperator from '@/components/DepositOperator.vue'
import TransactionStatus from '@/components/TransactionStatus.vue'

import { useGeneralStore } from './stores/generalStore';

const inputModeOn = ref(false);
const statusMessage = ref('')

const operationMode = ref('')

const withdraw = ref(null)
const deposit = ref(null)

const store = useGeneralStore()

const handleTransactionChoice = (choice) => {
  inputModeOn.value = true;
  operationMode.value = choice;
  statusMessage.value = '';
}

const handleInputCancel = () => {
  inputModeOn.value = false;
  statusMessage.value = "Operation Cancelled"
  operationMode.value = '';
  deposit.value.resetDeposit();
}

const handleInputEnter = (transactionAmount) => {
  if (operationMode.value === 'withdraw') {
    withdraw.value.performWithdraw(transactionAmount)
      .then(transactionData => {
        if (transactionData.operationSuccessful) {
          inputModeOn.value = false;
        }
        statusMessage.value = transactionData.statusMessage
      })
      .catch(error => {
        statusMessage.value = error.statusMessage
      });
  }
  else if (operationMode.value === 'deposit') {
    deposit.value.performDeposit(transactionAmount)
      .then(transactionData => {
        if (transactionData.needDeclarationFix) {
          inputModeOn.value = true;
        }
        else if (transactionData.operationSuccessful) {
          inputModeOn.value = false;
        }
        statusMessage.value = transactionData.statusMessage;
      })
      .catch(error => {
        statusMessage.value = error.statusMessage;
      });
  }
}

const handleFixDeclaration = (message) => {
  inputModeOn.value = true;
  statusMessage.value = message
}

const handleInsertMore = (message) => {
  inputModeOn.value = true;
  statusMessage.value = message;
}

const handleConfirm = () => {
  statusMessage.value = '';
}

</script>

<template>
  <h1 class="header">ATM</h1>
  <AccountBalanceDisplay :displayed-balance="store.getAccountBalance()"/>
  <TransactionStatus :status-message="statusMessage" @confirm="handleConfirm"/>
  <TransactionSelector 
    v-show="!inputModeOn && statusMessage.length === 0" 
    @transaction-chosen="handleTransactionChoice"
  />
  <UserInput
    v-if="inputModeOn"
    @cancel-input="handleInputCancel"
    @enter-input="handleInputEnter"
  />

  <WithdrawalOperator ref="withdraw"></WithdrawalOperator>
  <DepositOperator 
    ref="deposit" 
    @fix-declaration="handleFixDeclaration" 
    @insert-more="handleInsertMore"
  />
</template>

<style scoped>
.header {
  text-align: center;
}
</style>
