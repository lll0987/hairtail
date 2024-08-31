import { defineConfig, presetUno } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
import { status_colors, shades } from './src/contracts/component';

const safe_attrs = ['bg', 'text', 'border'];
const safe_colors = status_colors
    .map(color => shades.map(key => safe_attrs.map(attr => `${attr}-${color}-${key}`)))
    .flat(3);

export default defineConfig({
    presets: [presetUno(), presetAttributify()],
    safelist: safe_colors,
    shortcuts: [
        { bdr: 'border-2 border-slate-800' },
        { 'bdr-t': 'border-t-2 border-slate-800' },
        { 'bdr-r': 'border-r-2 border-slate-800' },
        { 'bdr-b': 'border-b-2 border-slate-800' },
        { 'bdr-l': 'border-l-2 border-slate-800' },
        { 'bdr-all': 'bdr has-[:focus]:border-lime-500 rounded-md' },
        { 'bdr-opacity': 'border-slate-300 border-opacity-70' },
        { 'bdr-dashed': 'border-slate-300 border-dashed' },
        { 'text-placeholder': 'text-zinc-400' },
        { 'flex-center': 'justify-center items-center' },
        { 'flex-between-center': 'justify-between items-center' },
        { reset: 'm-0 p-0 leading-none outline-none' },
        { 'reset-all': 'reset border-0 bg-transparent' },
        { 'x-center': 'left-1/2 -translate-x-1/2' },
        { 'y-center': 'top-1/2 -translate-y-1/2' },
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
        }
    ],
    rules: [
        ['size-small', { 'font-size': '0.875rem', padding: '0.25rem 0.5rem' }],
        ['size-large', { 'font-size': '1.125rem', padding: '0.5rem 1rem' }]
    ]
});
