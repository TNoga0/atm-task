<script setup>
import { ref } from 'vue';
import UserInput from '@/components/UserInput.vue';
import AccountBalanceDisplay from '@/components/AccountBalanceDisplay.vue'
import ActionSelector from '@/components/ActionSelector.vue'
import WithdrawalOperator from '@/components/WithdrawalOperator.vue'
import DepositOperator from '@/components/DepositOperator.vue'

import { useGeneralStore } from './stores/generalStore';

const inputModeOn = ref(false);
const statusMessage = ref('')

const operationMode = ref('')

const withdraw = ref(null)
const deposit = ref(null)

const store = useGeneralStore()

const handleActionChoice = (choice) => {
  inputModeOn.value = true;
  operationMode.value = choice;
  statusMessage.value = '';
}

const handleInputCancel = () => {
  inputModeOn.value = false;
  statusMessage.value = "Operation Cancelled"
}

const handleInputEnter = (transactionAmount) => {
  inputModeOn.value = false;
  if (operationMode.value === 'withdraw') {
    withdraw.value.performWithdraw(transactionAmount)
      .then(transactionData => {
        if (transactionData.operationSuccessful) {
          statusMessage.value = transactionData.statusMessage
        }
      })
      .catch(error => {
        statusMessage.value = error.statusMessage
      });
  }
  else if (operationMode.value === 'deposit') {
    deposit.value.performDeposit(transactionAmount)
      .then(transactionData => {
        if (transactionData.needDeclarationFix) {
          statusMessage.value = transactionData.statusMessage;
          inputModeOn.value = true;
        }
        else if (transactionData.needInsert) {
          statusMessage.value = transactionData.statusMessage;
        }
        else if (transactionData.operationSuccessful) {
          
        }
        statusMessage.value = transactionData.statusMessage;
      })
      .catch(error => {
        console.error(error);
      });
  }
}

const handleFixDeclaration = (message) => {
  inputModeOn.value = true;
  statusMessage.value = message
}

const handleInsertMore = (message) => {
  statusMessage.value = message;
}

const handleConfirm = () => {
  statusMessage.value = '';
}

</script>

<template>
  <h1 class="header">ATM</h1>
  <AccountBalanceDisplay :displayed-balance="store.getAccountBalance()"/>

  <h2 class="status-message" v-show="statusMessage.length != 0"> {{ statusMessage }} </h2>
  <button v-show="statusMessage.length != 0" class="confirm-operation-result" @click="handleConfirm">OK</button>
  <ActionSelector v-if="!inputModeOn && statusMessage.length === 0" @actionChosen="handleActionChoice"/>
  <UserInput 
    v-if="inputModeOn" 
    @cancel-input="handleInputCancel"
    @enter-input="handleInputEnter"
  />

  <WithdrawalOperator ref="withdraw"></WithdrawalOperator>
  <DepositOperator ref="deposit" @fix-declaration="handleFixDeclaration" @insert-more="handleInsertMore"></DepositOperator>
</template>

<style scoped>
.header {
  text-align: center;
}

.status-message {
  max-width: 50vw;
  text-align: center;
}

.confirm-operation-result {
  width: 5rem;
  justify-self: center;
  padding: 0.5rem;
}
</style>
