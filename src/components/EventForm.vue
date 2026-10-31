<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { EventInput } from "../types";
import { hasErrors, validateEvent } from "../validation";

defineProps<{ pending?: boolean }>();
const emit = defineEmits<{ submit: [input: EventInput] }>();

// <input type="datetime-local"> gives "2026-11-02T09:00" (local time, no zone)
const form = reactive({ title: "", category: "talk" as EventInput["category"], startsAt: "", location: "", capacity: 30, description: "" });
const submitted = ref(false);

const input = computed<EventInput>(() => ({
  ...form,
  title: form.title.trim(),
  location: form.location.trim(),
  startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : "",
}));
const errors = computed(() => validateEvent(input.value));

function onSubmit() {
  submitted.value = true;
  if (!hasErrors(errors.value)) emit("submit", input.value);
}
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <label>Title <input v-model="form.title" name="title" /></label>
    <p v-if="submitted && errors.title" class="error">{{ errors.title }}</p>

    <label>
      Category
      <select v-model="form.category" name="category">
        <option value="talk">Talk</option>
        <option value="workshop">Workshop</option>
        <option value="social">Social</option>
        <option value="sport">Sport</option>
      </select>
    </label>

    <label>Starts at <input v-model="form.startsAt" name="startsAt" type="datetime-local" /></label>
    <p v-if="submitted && errors.startsAt" class="error">{{ errors.startsAt }}</p>

    <label>Location <input v-model="form.location" name="location" /></label>
    <p v-if="submitted && errors.location" class="error">{{ errors.location }}</p>

    <label>Capacity <input v-model.number="form.capacity" name="capacity" type="number" min="1" /></label>
    <p v-if="submitted && errors.capacity" class="error">{{ errors.capacity }}</p>

    <label>Description <textarea v-model="form.description" name="description" rows="4" /></label>
    <p v-if="submitted && errors.description" class="error">{{ errors.description }}</p>

    <button type="submit" :disabled="pending">{{ pending ? "Saving..." : "Create event" }}</button>
  </form>
</template>

<style scoped>
form { display: flex; flex-direction: column; gap: 8px; max-width: 480px; }
label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
.error { color: #d73a49; margin: 0; font-size: 0.9rem; }
button { align-self: flex-start; margin-top: 8px; }
</style>
