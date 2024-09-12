import { defineComponent } from 'vue';
import { IconCheck, IconTrash, IconX } from '@tabler/icons-vue';

export default defineComponent({
    props: {
        type: {
            type: String,
            required: true,
            validator: (t: string) => ['positive', 'negative', 'danger'].includes(t)
        }
    },
    emits: ['click'],
    setup({ type }, { emit }) {
        return () => (
            <button
                type="button"
                class={['bg-transparent', 'w-6', `text-${type}`]}
                onClick={() => emit('click')}
            >
                {type === 'positive' ? (
                    <IconCheck></IconCheck>
                ) : type === 'danger' ? (
                    <IconTrash></IconTrash>
                ) : (
                    <IconX></IconX>
                )}
            </button>
        );
    }
});
