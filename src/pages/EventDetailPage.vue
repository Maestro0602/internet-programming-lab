<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useEventsStore } from "../stores/events";
import { useBookingsStore } from "../stores/bookings";
import { formatDate, seatsLeft } from "../format";
import type { BookingInput, CampusEvent } from "../types";
import BookingForm from "../components/BookingForm.vue";
import StatusMessage from "../components/StatusMessage.vue";

// With `props: true` in the route, the :id param arrives as a prop (a string)
const props = defineProps<{ id: string }>();
const router = useRouter();
const events = useEventsStore();
const bookings = useBookingsStore();

const loadError = ref<string | null>(null);
const bookError = ref<string | null>(null);
const pending = ref(false);
const eventId = computed(() => Number(props.id));
// Read from the store so the seat count updates after booking
const event = computed<CampusEvent | undefined>(() => events.byId(eventId.value));
const left = computed(() => (event.value ? seatsLeft(event.value) : 0));

async function load() {
  loadError.value = null;
  try {
    await events.fetchOne(eventId.value);
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : "Could not load the event.";
  }
}
// The same component is reused when only the :id changes, so watch it
watch(eventId, load, { immediate: true });

async function onBook(input: BookingInput) {
  if (!event.value) return;
  pending.value = true;
  bookError.value = null;
  try {
    await bookings.book(event.value, input);
    router.push({ name: "my-bookings" });
  } catch (e) {
    bookError.value = e instanceof Error ? e.message : "Booking failed.";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <RouterLink to="/">&larr; All events</RouterLink>

  <StatusMessage v-if="loadError" kind="error" :message="loadError" @retry="load" />
  <StatusMessage v-else-if="!event" kind="loading" />
  <article v-else class="detail">
    <p class="category">{{ event.category }}</p>
    <h1>{{ event.title }}</h1>
    <p class="meta">{{ formatDate(event.startsAt) }} · {{ event.location }}</p>
    <p>{{ event.description }}</p>

    <h2>Book</h2>
    <p v-if="left === 0" class="badge">This event is full.</p>
    <template v-else>
      <p>{{ left }} seat{{ left === 1 ? "" : "s" }} left.</p>
      <p v-if="bookError" class="error" role="alert">{{ bookError }}</p>
      <BookingForm :seats-left="left" :pending="pending" @submit="onBook" />
    </template>
  </article>
</template>

<style scoped>
.detail { background: white; border-radius: 10px; padding: 24px; margin-top: 12px; }
.category { text-transform: uppercase; font-size: 0.75rem; color: #3178c6; margin: 0; }
h1 { margin: 4px 0; }
.meta { color: #6b7280; }
.error, .badge { color: #d73a49; font-weight: 600; }
</style>
