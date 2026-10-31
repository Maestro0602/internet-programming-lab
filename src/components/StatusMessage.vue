<script setup lang="ts">
// Shared loading / error box so every page handles these states the same way
defineProps<{ kind: "loading" | "error"; message?: string }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="status" :class="kind" :role="kind === 'error' ? 'alert' : 'status'">
    <template v-if="kind === 'loading'">Loading...</template>
    <template v-else>
      <p>{{ message ?? "Something went wrong." }}</p>
      <button @click="$emit('retry')">Try again</button>
    </template>
  </div>
</template>

<style scoped>
.status { padding: 32px; text-align: center; background: white; border-radius: 10px; }
.error { color: #d73a49; }
.error p { margin-top: 0; }
</style>
