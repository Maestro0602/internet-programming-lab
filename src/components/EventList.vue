<script setup lang="ts">
import { toRef } from "vue";
import type { CampusEvent } from "../types";
import { useEventFilters } from "../composables/useEventFilters";
import EventCard from "./EventCard.vue";

const props = defineProps<{ events: CampusEvent[] }>();
const { search, category, visible } = useEventFilters(toRef(props, "events"));
</script>

<template>
  <section>
    <div class="filters">
      <input v-model="search" type="search" placeholder="Search title or location" aria-label="Search" />
      <select v-model="category" aria-label="Category">
        <option value="all">All categories</option>
        <option value="talk">Talks</option>
        <option value="workshop">Workshops</option>
        <option value="social">Social</option>
        <option value="sport">Sport</option>
      </select>
    </div>

    <p class="count">{{ visible.length }} of {{ events.length }} events</p>

    <div v-if="visible.length" class="grid">
      <EventCard v-for="e in visible" :key="e.id" :event="e" />
    </div>
    <p v-else class="empty">No events match your search.</p>
  </section>
</template>

<style scoped>
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filters input { flex: 1; min-width: 200px; }
.count { color: #6b7280; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.empty { padding: 32px; text-align: center; background: white; border-radius: 10px; }
</style>
