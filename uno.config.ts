import { defineConfig, presetUno } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
import { status_colors, shades, size_shortcuts } from './src/contracts/component';
import { view_shortcuts } from './src/renderer/src/views/class';
import { widget_shortcuts } from './src/renderer/src/widgets/class';

const safe_attrs = ['bg', 'text', 'border'];
const safe_colors = status_colors
    .map(color => shades.map(key => safe_attrs.map(attr => `${attr}-${color}-${key}`)))
    .flat(3);

const safe_sizes = size_shortcuts.map(i => Object.keys(i)).flat(2);

export default defineConfig({
    presets: [presetUno(), presetAttributify()],
    safelist: [...safe_colors, ...safe_sizes],
    shortcuts: [
        { 'text-placeholder': 'text-zinc-400' },
        { 'text-danger': 'text-red-600 dark:text-red-500' },
        { 'text-positive': 'text-green-600 dark:text-green-400' },
        { 'text-negative': 'text-slate-600 dark:text-slate-300' },
        { 'border-auto': 'border-slate-800 dark:border-slate-950' },
        ...view_shortcuts,
        ...widget_shortcuts,
        { bdr: 'border-2 border-slate-800 dark:border-black' },
        { card: 'bdr dark:border-4 rounded-3xl bg-white dark:bg-neutral-800' },
        {
            decorative: [
                'font-semibold',
                'pl-2',
                'relative',
                'after:content-[""]',
                'after:absolute',
                'after:left-0',
                'after:y-center',
                'after:w-[4px]',
                'after:h-[1.2em]',
                'after:bg-sky-400',
                'after:rounded-sm'
            ]
        },
        {
            marker: [
                'pl-4',
                'relative',
                'before:content-[""]',
                'before:absolute',
                'before:left-0',
                'before:top-1/2',
                'before:-translate-y-[0.2em]',
                'before:w-[0.5em]',
                'before:h-[0.5em]',
                'before:bg-sky-400',
                'before:rounded-full'
            ]
        },
        { 'x-center': 'left-1/2 -translate-x-1/2' },
        { 'y-center': 'top-1/2 -translate-y-1/2' },
        { 'flex-center': 'justify-center items-center' },
        ...size_shortcuts,
        { 'bdr-t': 'border-t-2 border-slate-800' },
        { 'bdr-r': 'border-r-2 border-slate-800' },
        { 'bdr-b': 'border-b-2 border-slate-800' },
        { 'bdr-l': 'border-l-2 border-slate-800' },
        { 'bdr-all': 'bdr has-[:focus]:border-lime-500 rounded-md' },
        { 'bdr-opacity': 'border-slate-300 border-opacity-70' },
        { 'bdr-dashed': 'border-slate-300 border-dashed' },
        { 'flex-between-center': 'justify-between items-center' },
        { reset: 'm-0 p-0 leading-none outline-none' },
        { 'reset-all': 'reset border-0 bg-transparent' }
    ],
    rules: [
        [/^grid-cols-auto-(\d+)$/, ([, d]) => ({ 'grid-template-columns': `repeat(${d}, minmax(0, auto))` })],
        [/^grid-rows-auto-(\d+)$/, ([, d]) => ({ 'grid-template-rows': `repeat(${d}, minmax(0, auto))` })]
    ]
});
