<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useEventsStore } from "../stores/events";
import type { EventInput } from "../types";
import EventForm from "../components/EventForm.vue";

const store = useEventsStore();
const router = useRouter();
const pending = ref(false);
const error = ref<string | null>(null);

async function onSubmit(input: EventInput) {
  pending.value = true;
  error.value = null;
  try {
    const created = await store.create(input);
    router.push({ name: "event-detail", params: { id: created.id } });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Could not create the event.";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <h1>New event</h1>
  <p v-if="error" class="error" role="alert">{{ error }}</p>
  <EventForm :pending="pending" @submit="onSubmit" />
</template>

<style scoped>
.error { color: #d73a49; font-weight: 600; }
</style>
