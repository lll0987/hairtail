import { computed, ref } from 'vue';
import routes from './routes';

const router = ref<string>(routes[0].key);
const updateRouter = (key: string) => {
    router.value = key;
};

const activedRouter = computed(() => router.value);
const activedComponent = computed(() => routes.find(i => i.key === router.value)?.component);

export { routes, activedComponent, activedRouter, updateRouter };
