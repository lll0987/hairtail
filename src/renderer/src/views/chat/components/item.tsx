import { computed, defineComponent, h, PropType } from 'vue';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/an-old-hope.min.css';

import { IRecord } from '@t/interface';
import { RecordStatus } from '@t/enum';

import Loading from '@renderer/components/loading';
import Button from '@renderer/components/button';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const SEND = RecordStatus.SEND;
const WAIT = RecordStatus.WAITING;
const ACCEPT = RecordStatus.ACCEPT;
const IGNORE = RecordStatus.IGNORE;

const classes = [
    'max-w-[90%]',
    'min-w-400',
    'px-16',
    'py-6',
    'rounded-3xl',
    'rounded-tl-none',
    'border-slate-800',
    'border-2'
];
const BG = 'bg-white';
const ACCEPT_BG = 'bg-green-300';
const IGNORE_BG = 'bg-slate-300';

export default defineComponent({
    inheritAttrs: false,
    props: {
        item: { type: Object as PropType<IRecord>, required: true }
    },
    emits: ['accept', 'ignore'],
    setup(props, ctx) {
        const status = computed(() => props.item.status);
        const out = computed(() => props.item.out);

        // 等待外部 api 结果
        if (status.value === SEND)
            return () =>
                h(
                    'div',
                    { class: [...classes, BG] },
                    h('div', { class: ['flex', 'items-center'] }, [
                        h(Loading, { size: 24, class: 'mr-6' }),
                        h('span', { class: 'font-semibold' }, '转换中')
                    ])
                );

        // 等待用户接受/忽略
        if (status.value === WAIT)
            return () =>
                h('div', { class: [...classes, BG] }, [
                    h(
                        'div',
                        {
                            class: [
                                'grid',
                                'grid-rows-1',
                                'grid-cols-[1fr_auto_auto]',
                                'gap-8',
                                'items-center',
                                'py-10'
                            ]
                        },
                        [
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
                                '转换结果'
                            ),
                            h(
                                Button,
                                {
                                    type: 'success',
                                    size: 'small',
                                    onClick: () => ctx.emit('accept', props.item)
                                },
                                '接受'
                            ),
                            h(
                                Button,
                                { size: 'small', onClick: () => ctx.emit('ignore', props.item) },
                                '忽略'
                            )
                        ]
                    ),
                    h('div', { innerHTML: marked.parse(out.value) })
                ]);

        // NEXT 收起展开结果
        // 已接受
        if (status.value === ACCEPT) return () => h('div', { class: [...classes, ACCEPT_BG] }, '已接受');
        // 已忽略
        if (status.value === IGNORE) return () => h('div', { class: [...classes, IGNORE_BG] }, '已忽略');

        return () => h('div', { class: [...classes, BG] }, out.value);
    }
});
