import { RawData, S2DataConfig } from '@antv/s2';
import { EVENT_GRAIN } from '@contracts/component';
import { IEventRawData } from '@contracts/interface';
import { useS2Data } from './use-s2-data';

export const useS2Config = (events: IEventRawData[]): S2DataConfig => {
    const data: RawData[] = useS2Data(events) as unknown as RawData[];
    return {
        fields: {
            rows: ['key'],
            columns: ['date_start'],
            values: ['time_length']
        },
        sortParams: [
            {
                sortFieldId: 'date_start',
                sortFunc: params => {
                    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
                    return (
                        params.data?.sort((a, b) => {
                            const acell = a as string;
                            const bcell = b as string;
                            const [, ayear, amonth, adate] = acell.match(regex) as RegExpMatchArray;
                            const [, byear, bmonth, bdate] = bcell.match(regex) as RegExpMatchArray;
                            if (ayear !== byear) return Number(ayear) - Number(byear);
                            if (amonth !== bmonth) return Number(amonth) - Number(bmonth);
                            return Number(adate) - Number(bdate);
                        }) ?? []
                    );
                }
            },
            {
                sortFieldId: 'key',
                sortFunc: params => {
                    return (
                        params.data?.sort((a, b) => {
                            const acell = a as string;
                            const bcell = b as string;
                            if (acell === EVENT_GRAIN.DATE_RANGE) return -1;
                            if (bcell === EVENT_GRAIN.DATE_RANGE) return 1;
                            if (acell === EVENT_GRAIN.DATE) return -1;
                            if (bcell === EVENT_GRAIN.DATE) return 1;
                            return Number(acell) - Number(bcell);
                        }) ?? []
                    );
                }
            }
        ],
        data
    };
};
