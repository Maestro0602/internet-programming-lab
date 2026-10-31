<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore, type Role } from "./stores/session";
import { useBookingsStore } from "./stores/bookings";

const session = useSessionStore();
const { role, isOrganiser } = storeToRefs(session);
const { totalSeats } = storeToRefs(useBookingsStore());
</script>

<template>
  <header class="top">
    <nav>
      <RouterLink to="/" class="brand">Campus Events</RouterLink>
      <RouterLink to="/my-bookings">My bookings<span v-if="totalSeats"> ({{ totalSeats }})</span></RouterLink>
      <RouterLink v-if="isOrganiser" to="/events/new">New event</RouterLink>
    </nav>
    <label class="role">
      Role
      <select :value="role" aria-label="Role" @change="session.setRole(($event.target as HTMLSelectElement).value as Role)">
        <option value="student">Student</option>
        <option value="organiser">Organiser</option>
      </select>
    </label>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.top { background: #1b1b1f; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
nav { display: flex; gap: 16px; align-items: center; }
nav a { color: #e5e7eb; text-decoration: none; }
nav a.router-link-exact-active { color: #f7df1e; }
.brand { font-weight: 700; font-size: 1.1rem; }
.role { display: flex; gap: 8px; align-items: center; }
</style>
