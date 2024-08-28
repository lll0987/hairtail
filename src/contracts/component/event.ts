export const EVENT_GRAIN = {
    DATE: '2300',
    DATE_RANGE: '2314',
    TIME: '1500',
    TIME_RANGE: '1514'
} as const;

export type TEventGrain = typeof EVENT_GRAIN;
export type EventGrain = TEventGrain[keyof TEventGrain];
