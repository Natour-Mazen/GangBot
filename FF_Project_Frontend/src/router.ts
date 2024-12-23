import { createMemoryHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HelloWorld from "./components/HelloWorld.vue";

const routes: RouteRecordRaw[] = [
     { path: '/hello', component: HelloWorld },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});

export default router;
