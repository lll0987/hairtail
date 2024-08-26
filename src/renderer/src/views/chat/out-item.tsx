import { defineComponent, h, PropType, VNode } from 'vue';
import { IconLoader2 } from '@tabler/icons-vue';
import type { IRecord } from '@contracts/interface';
import { getStatusColor, RECORD_STATUS } from '@contracts/component';
import { AgButton } from '@renderer/components';
import marked from './marked';

export default defineComponent({
    props: { item: { type: Object as PropType<IRecord>, required: true } },
    emits: ['accept', 'ignore'],
    setup({ item }, { emit }) {
        const { status, out } = item;
        let classes: string[] = ['bg-white'];
        let text: string | null = out;
        let detail: VNode | VNode[] | null = null;
        if (status === RECORD_STATUS.ACCEPT) {
            classes = ['bg-' + getStatusColor('success', '300'), 'font-semibold'];
            text = '已接受';
        }
        if (status === RECORD_STATUS.IGNORE) {
            classes = ['bg-slate-300', 'font-semibold'];
            text = '已忽略';
        }
        if (status === RECORD_STATUS.SEND) {
            classes.push('font-semibold');
            text = null;
            detail = (
                <div class="flex items-center gap-1">
                    <IconLoader2 size="1.25em" class="animate-spin"></IconLoader2>
                    <span>转换中</span>
                </div>
            );
        }
        if (status === RECORD_STATUS.WAITING) {
            text = null;
            detail = [
                <div grid="~ rows-1 cols-[1fr_auto_auto]" items="center" gap="2" py="2.5">
                    <span class="decorative">转换结果</span>
                    <AgButton size="small" status="success" {...{ onclick: () => emit('accept', item) }}>
                        接受
                    </AgButton>
                    <AgButton size="small" {...{ onclick: () => emit('ignore', item) }}>
                        忽略
                    </AgButton>
                </div>,
                h('div', { innerHTML: marked(out) })
            ];
        }
        return () => (
            <div p="x-4 y-1.5" rounded="3xl tl-none" class={['max-w-[90%]', 'bdr', ...classes]}>
                {text === null ? <span>{text}</span> : text}
                {detail}
            </div>
        );
    }
});
