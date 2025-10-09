<script setup>
defineProps({
  productos: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="h-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              v-for="(valor, key) in productos[0] || {}"
              :key="key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"
              v-if="!['conteo', 'suma', 'busquedas'].includes(key)"
            >
              {{ key }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
              Conteo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
              Suma
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">
              Búsquedas
            </th>
          </tr>
        </thead>

        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
          <tr 
            v-for="(producto, i) in productos" 
            :key="i" 
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <td
              v-for="(valor, key) in producto"
              :key="key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 max-w-[200px] truncate transition-colors duration-300"
              v-if="!['conteo', 'suma', 'busquedas'].includes(key)"
            >
              {{ valor }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-semibold transition-colors duration-300">
              {{ producto.conteo || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-semibold transition-colors duration-300">
              {{ producto.suma || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center font-semibold transition-colors duration-300">
              {{ producto.busquedas || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>