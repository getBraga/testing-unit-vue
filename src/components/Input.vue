<template>
  <div>
    <div class="mb-3">
      <label :for="id" class="form-label">{{ label }}</label>
      <input
        :type="type"
        class="form-control"
        :class="{ 'is-invalid': help }"
        :id="id"
        :value="modelValue"
        @input="this.$emit('update:modelValue', $event.target.value)"
      />
      <span v-if="help" class="invalid-feedback">{{ help }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Input-Default",
  emits: ["update:modelValue"],
  props: {
    label: String,
    id: String,
    help: String,
    modelValue: String,
    type: String,
  },
};
</script>

<style></style>
