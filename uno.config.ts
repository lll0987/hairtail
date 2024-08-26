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
        { bdr: 'border-2 border-slate-800 has-[:focus]:border-lime-500 rounded' },
        { 'bdr-2': 'border-slate-300 border-opacity-70' },
        { 'flex-center': 'justify-center items-center' },
        { 'flex-between-center': 'justify-between items-center' },
        { reset: 'm-0 p-0 leading-none outline-none' },
        { 'reset-all': 'm-0 p-0 leading-none border-0 outline-none bg-transparent' }
    ],
    rules: [
        ['size-small', { 'font-size': '0.875rem', padding: '0.25rem 0.5rem' }],
        ['size-large', { 'font-size': '1.125rem', padding: '0.5rem 1rem' }]
    ]
});
