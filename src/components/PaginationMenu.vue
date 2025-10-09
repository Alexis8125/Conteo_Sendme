<template>
  <div class="flex items-center justify-center mt-4">
    <ul class="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors duration-300">
      <li>
        <button
          class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors duration-300"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          «
        </button>
      </li>

      <li>
        <button
          class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors duration-300"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ‹
        </button>
      </li>

      <li v-for="page in pages" :key="page">
        <button
          class="px-3 py-2 border-l border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          :class="{
            'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600': page === currentPage,
            'text-gray-700 dark:text-gray-300': page !== currentPage
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-l border-gray-300 dark:border-gray-600 disabled:opacity-40 transition-colors duration-300"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          ›
        </button>
      </li>

      <li>
        <button
          class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-l border-gray-300 dark:border-gray-600 disabled:opacity-40 transition-colors duration-300"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          »
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalPages: { type: Number, required: true },
  currentPage: { type: Number, required: true }
})

const emit = defineEmits(['page-change'])

const pages = computed(() => 
  Array.from({ length: props.totalPages }, (_, i) => i + 1)
)

function goToPage(page) {
  if (page < 1 || page > props.totalPages) return
  emit('page-change', page)
}
</script>