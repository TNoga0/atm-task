<script setup>
import {ref} from 'vue';
import InputDisplay from './InputDisplay.vue';

const emit = defineEmits(['cancelInput', 'clearInput', 'enterInput'])

const userInputValue = ref('')

const pressKey = (num) => {
  userInputValue.value += num;
}

const cancelInput = () => {
  userInputValue.value = '';
  emit('cancelInput');
}

const clearInput = () => {
  userInputValue.value = '';
  emit('clearInput');
}

const enterInput = () => {
  emit('enterInput', userInputValue.value);
  clearInput();
}
</script>

<template>
  <div class="user-input">
    <InputDisplay :displayed-text="userInputValue"/>
    <div class="keypad">
      <div v-for="num in [7,8,9]" :key="num" class="key" @click="pressKey(`${num}`)">{{ num }}</div>
      <div class="key blank"></div> <!-- Blank space -->
      <div v-for="num in [4,5,6]" :key="num" class="key" @click="pressKey(`${num}`)">{{ num }}</div>
      <div class="cancel key" @click="cancelInput">Cancel</div>
      <div v-for="num in [1,2,3]" :key="num" class="key" @click="pressKey(`${num}`)">{{ num }}</div>
      <div class="clear key" @click="clearInput">Clear</div>
      <div class="key zero-key" @click="pressKey('0')">0</div>
      <div class="enter key" @click="enterInput">Enter</div>
    </div>
  </div>
</template>

<style scoped>
.user-input { 
  display: flex;
  flex-direction: column;
  align-items: center;
}
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns */
  gap: 0.1em;
}
.key, .zero-key, .blank {
  text-align: center;
  line-height: 3em; /* Adjust line height for better vertical alignment */
  border: 1px solid #ccc;
  cursor: pointer;
}
.blank {
  background: none;
  border: none;
  cursor: default !important;
}
.zero-key { 
  grid-column: span 3; /* Zero key spans three columns */
}
.cancel {
  background-color: #f53939;
  width: 4rem;
}
.enter {
  background-color: rgb(66, 139, 66);
}
.clear {
  background-color: rgb(233, 233, 87);
}
</style>