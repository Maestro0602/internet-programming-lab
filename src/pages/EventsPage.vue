<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useEventsStore } from "../stores/events";
import EventList from "../components/EventList.vue";
import StatusMessage from "../components/StatusMessage.vue";

const store = useEventsStore();
// storeToRefs keeps reactivity when destructuring state and getters
const { events, status, error } = storeToRefs(store);
const route = useRoute();

onMounted(() => {
  if (status.value !== "success") store.fetchAll();
});
</script>

<template>
  <h1>Upcoming events</h1>
  <p v-if="route.query.denied" class="notice" role="alert">Only organisers can create events.</p>

  <StatusMessage v-if="status === 'loading' || status === 'idle'" kind="loading" />
  <StatusMessage v-else-if="status === 'error'" kind="error" :message="error ?? undefined" @retry="store.fetchAll()" />
  <p v-else-if="events.length === 0" class="empty">No events yet.</p>
  <EventList v-else :events="events" />
</template>

<style scoped>
.notice { background: #fff8c5; padding: 8px 12px; border-radius: 6px; }
.empty { padding: 32px; text-align: center; background: white; border-radius: 10px; }
</style>
