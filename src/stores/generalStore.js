import { ref } from 'vue'
import { defineStore } from 'pinia'
import {getAccBalance} from '@/utils';

export const useGeneralStore = defineStore('general', () => {
  const availableBanknotes = ref([500, 200, 100, 50, 20, 10]);

  const setAccountBalance = (balance) => {
    localStorage.setItem('accountBalance', balance)
  }

  const getAccountBalance = () => {
    return getAccBalance();
  }

  return { availableBanknotes, getAccountBalance, setAccountBalance }
})
