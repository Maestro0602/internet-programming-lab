<script setup lang="ts">
import { computed } from "vue";
import type { CampusEvent } from "../types";
import { formatDate, seatsLeft } from "../format";

const props = defineProps<{ event: CampusEvent }>();

const left = computed(() => seatsLeft(props.event));
const isFull = computed(() => left.value === 0);
const almostFull = computed(() => left.value > 0 && left.value <= 5);
</script>

<template>
  <article class="card" :class="{ full: isFull }">
    <p class="category">{{ event.category }}</p>
    <h2>
      <RouterLink :to="{ name: 'event-detail', params: { id: event.id } }">{{ event.title }}</RouterLink>
    </h2>
    <p class="meta">{{ formatDate(event.startsAt) }} · {{ event.location }}</p>

    <p v-if="isFull" class="badge">Full</p>
    <p v-else class="seats" :class="{ warn: almostFull }">
      {{ left }} seat{{ left === 1 ? "" : "s" }} left
    </p>
  </article>
</template>

<style scoped>
.card { background: white; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.card.full { opacity: 0.7; }
h2 { font-size: 1.1rem; margin: 0; }
h2 a { color: inherit; text-decoration: none; }
h2 a:hover { text-decoration: underline; }
.category { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #3178c6; margin: 0; }
.meta { color: #6b7280; margin: 0; }
.seats, .badge { margin: 0; font-weight: 600; }
.warn { color: #d73a49; }
.badge { color: white; background: #d73a49; align-self: flex-start; padding: 2px 10px; border-radius: 999px; }
</style>
