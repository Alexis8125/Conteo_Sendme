<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :disabled="disabled"
    @click="emit('click')"
    :class="[
      'px-4 py-2 font-medium rounded transition-colors duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-green-600 hover:bg-green-700 text-white': color === 'green',
        'bg-red-600 hover:bg-red-700 text-white': color === 'red',
        'bg-blue-600 hover:bg-blue-700 text-white': color === 'blue',
        'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-black dark:text-white': color === 'gray',
      },
    ]"
  >
    {{ label }}
  </button>
</template>
