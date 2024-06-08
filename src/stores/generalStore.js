import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', () => {
  const availableBanknotes = ref([500, 200, 100, 50, 20, 10]);
  const accountBalance = ref(parseInt(localStorage.getItem('accountBalance')) || 550)

  const setAccountBalance = (balance) => {
    accountBalance.value = balance;
    localStorage.setItem('accountBalance', balance)
  }

  const getAccountBalance = () => {
    return accountBalance.value
  }

  return { availableBanknotes, getAccountBalance, setAccountBalance }
})
