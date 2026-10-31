import { defineStore } from "pinia";
import { computed, ref } from "vue";

// Week 5 stand-in for login: pick a role in the header. Real auth comes in week 8.
export type Role = "student" | "organiser";

export const useSessionStore = defineStore("session", () => {
  const role = ref<Role>("student");
  const isOrganiser = computed(() => role.value === "organiser");
  function setRole(r: Role) { role.value = r; }
  return { role, isOrganiser, setRole };
});
