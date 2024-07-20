import { defineComponent, h } from 'vue';

export default defineComponent({
    setup(_, ctx) {
        return () =>
            h(
                'span',
                {
                    class: [
                        'font-semibold',
                        'pl-8',
                        'relative',
                        'after:absolute',
                        'after:left-0',
                        'after:top-1/2',
                        'after:-translate-y-1/2',
                        'after:w-4',
                        'after:h-[1.2em]',
                        'after:bg-sky-400',
                        'after:rounded-sm'
                    ]
                },
                ctx.slots.default?.()
            );
    }
});
