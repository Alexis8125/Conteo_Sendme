<template>
  <div class="field">
    <label v-if="label" :for="id" class="block text-900 font-medium mb-2">
      {{ label }}
    </label>
    <Password
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      :feedback="false"
      toggleMask
      class="w-full"
      inputClass="w-full"
      :class="{ 'p-invalid': error }"
    />
    <small v-if="error" class="p-error">{{ error }}</small>
  </div>
</template>

<script setup>
import Password from 'primevue/password'

defineProps({
  id: String,
  label: String,
  modelValue: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String
})

defineEmits(['update:modelValue'])
</script>