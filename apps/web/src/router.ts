import { createRouter, createWebHistory } from "vue-router";

import AuditTrailView from "./views/AuditTrailView.vue";
import DashboardView from "./views/DashboardView.vue";
import IntegrationHealthView from "./views/IntegrationHealthView.vue";
import InventoryView from "./views/InventoryView.vue";
import SignalsView from "./views/SignalsView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: DashboardView },
    { path: "/inventory", component: InventoryView },
    { path: "/signals", component: SignalsView },
    { path: "/integrations", component: IntegrationHealthView },
    { path: "/audit", component: AuditTrailView },
  ],
});
