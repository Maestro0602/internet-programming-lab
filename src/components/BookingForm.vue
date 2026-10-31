<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { BookingInput } from "../types";
import { hasErrors, validateBooking } from "../validation";

const props = defineProps<{ seatsLeft: number; pending?: boolean }>();
const emit = defineEmits<{ submit: [input: BookingInput] }>();

// EventForm.vue is a finished form: use it as your pattern.
// TODO C2: a reactive `form` object { name: "", email: "", seats: 1 }
const form = reactive({ name: "", email: "", seats: 1 });

// TODO C3: `submitted` (ref, false) and `errors` (computed with validateBooking)
const submitted = ref(false);

const input = computed<BookingInput>(() => ({
  name: form.name.trim(),
  email: form.email.trim(),
  seats: form.seats,
}));

const errors = computed(() => validateBooking(input.value, props.seatsLeft));

// TODO C4: onSubmit(): set submitted; stop if there are errors;
//          otherwise emit "submit" with the trimmed name and email, and seats
function onSubmit() {
  submitted.value = true;
  if (!hasErrors(errors.value)) {
    emit("submit", input.value);
  }
}
</script>

<template>
  <!-- TODO C5: v-model each input (seats with v-model.number);
       show each error in a <p class="error"> under its field, only after the first submit;
       disable the button and show "Booking..." while pending -->
  <form novalidate @submit.prevent="onSubmit">
    <label>
      Name
      <input v-model="form.name" name="name" autocomplete="name" />
    </label>
    <p v-if="submitted && errors.name" class="error">{{ errors.name }}</p>

    <label>
      Email
      <input v-model="form.email" name="email" type="email" autocomplete="email" />
    </label>
    <p v-if="submitted && errors.email" class="error">{{ errors.email }}</p>

    <label>
      Seats
      <input v-model.number="form.seats" name="seats" type="number" min="1" max="4" />
    </label>
    <p v-if="submitted && errors.seats" class="error">{{ errors.seats }}</p>

    <button type="submit" :disabled="pending">{{ pending ? "Booking..." : "Book" }}</button>
  </form>
</template>

<style scoped>
form { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
.error { color: #d73a49; margin: 0; font-size: 0.9rem; }
button { align-self: flex-start; margin-top: 8px; }
</style>
