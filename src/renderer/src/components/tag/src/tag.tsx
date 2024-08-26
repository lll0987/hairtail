import { defineComponent, h } from 'vue';
import { useTagRender } from '@renderer/hooks';

export default defineComponent({
    props: { name: { type: String, required: true } },
    setup({ name }) {
        const { type, props, children } = useTagRender(name);
        return () => h(type, props, children);
    }
});
