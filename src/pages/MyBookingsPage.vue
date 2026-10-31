<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useBookingsStore } from "../stores/bookings";
import { useEventsStore } from "../stores/events";
import type { Booking } from "../types";
import StatusMessage from "../components/StatusMessage.vue";

const store = useBookingsStore();
const events = useEventsStore();
const { bookings, loading, totalSeats } = storeToRefs(store);
const error = ref<string | null>(null);

async function load() {
  error.value = null;
  try {
    await Promise.all([store.fetchAll(), events.status === "success" ? null : events.fetchAll()]);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Could not load bookings.";
  }
}
onMounted(load);

const title = (b: Booking) => events.byId(b.eventId)?.title ?? `Event #${b.eventId}`;

async function onCancel(b: Booking) {
  if (!confirm(`Cancel ${b.seats} seat(s) for ${title(b)}?`)) return;
  try {
    await store.cancel(b);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Could not cancel.";
  }
}
</script>

<template>
  <h1>My bookings</h1>
  <StatusMessage v-if="error" kind="error" :message="error" @retry="load" />
  <StatusMessage v-else-if="loading" kind="loading" />
  <p v-else-if="bookings.length === 0" class="empty">
    You have no bookings yet. <RouterLink to="/">Browse events</RouterLink>
  </p>
  <template v-else>
    <p>{{ totalSeats }} seat{{ totalSeats === 1 ? "" : "s" }} in {{ bookings.length }} booking{{ bookings.length === 1 ? "" : "s" }}.</p>
    <ul class="list">
      <li v-for="b in bookings" :key="b.id">
        <RouterLink :to="{ name: 'event-detail', params: { id: b.eventId } }">{{ title(b) }}</RouterLink>
        <span>{{ b.seats }} seat{{ b.seats === 1 ? "" : "s" }} for {{ b.name }}</span>
        <button class="secondary" @click="onCancel(b)">Cancel</button>
      </li>
    </ul>
  </template>
</template>

<style scoped>
.empty { padding: 32px; text-align: center; background: white; border-radius: 10px; }
.list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.list li { background: white; border-radius: 10px; padding: 12px 16px; display: flex; gap: 16px; align-items: center; }
.list li span { flex: 1; color: #6b7280; }
.secondary { background: #d73a49; }
</style>
