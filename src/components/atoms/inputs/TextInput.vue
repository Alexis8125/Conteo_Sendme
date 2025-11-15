<template>
  <div class="field">
    <label v-if="label" :for="id" class="block text-900 font-medium mb-2">
      {{ label }}
    </label>
    <InputText
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full"
      :class="{ 'p-invalid': error }"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
    <small v-if="helperText" class="text-600">{{ helperText }}</small>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number],
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  helperText: String
})

defineEmits(['update:modelValue'])
</script>