import { WPill, WRemind, WSleep } from '@renderer/widgets';

export const compat = {
    pill: WPill,
    sleep: WSleep,
    remind: WRemind
} as const;

type TCompatName = keyof typeof compat;

export interface ICompat {
    type: TCompatName;
    class?: string | string[];
    [k: string]: string | number | string[] | undefined;
}
