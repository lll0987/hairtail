import { EXTRA_FIELD, type RawData, type S2DataConfig, type S2Options } from '@antv/s2';

import { DateColCell, ShapeCornerCell, TimeRowCell, ShapeDataCell } from '../s2/cells';

import { useData } from './useData';
import { useHeight } from './useRow';

import { DateTimeGrain } from '@t/enum';
import { EventRawData } from '@t/interface';

const initConfig = (events: EventRawData[]): S2DataConfig => {
    const data = useData(events) as unknown as RawData[];
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
                            if (acell === DateTimeGrain.DATE_RANGE) return -1;
                            if (bcell === DateTimeGrain.DATE_RANGE) return 1;
                            if (acell === DateTimeGrain.DATE) return -1;
                            if (bcell === DateTimeGrain.DATE) return 1;
                            return Number(acell) - Number(bcell);
                        }) ?? []
                    );
                }
            }
        ],
        data
    };
};

export const initOptions = (width: number, height: number): S2Options => {
    const { ColHeight, RowHeight, DateRowHeight, DateRangeRowHeight } = useHeight(height);
    return {
        width,
        height,
        style: {
            // NEXT 列宽根据总宽度计算
            colCell: { width: 100, height: ColHeight, heightByField: { [EXTRA_FIELD]: 0 } },
            rowCell: {
                width: 60,
                height: RowHeight,
                heightByField: {
                    [`root[&]${DateTimeGrain.DATE}`]: DateRowHeight,
                    [`root[&]${DateTimeGrain.DATE_RANGE}`]: DateRangeRowHeight
                }
            }
        },
        // NEXT tooltip
        interaction: {
            // 禁止修改尺寸
            resize: {
                rowCellVertical: false,
                cornerCellHorizontal: false,
                colCellHorizontal: false,
                colCellVertical: false
            },
            // 调整滚动速度
            scrollSpeedRatio: {
                vertical: 0.5,
                horizontal: 0.2
            }
        },
        dataCell: (viewMeta, spreadsheet) => new ShapeDataCell(viewMeta, spreadsheet),
        rowCell: (node, spreadsheet, headerConfig) => new TimeRowCell(node, spreadsheet, headerConfig),
        colCell: (viewMeta, spreadsheet, headerConfig) =>
            new DateColCell(viewMeta, spreadsheet, headerConfig),
        cornerCell: (viewMeta, spreadsheet) => new ShapeCornerCell(viewMeta, spreadsheet)
    };
};

export const useOptions = (width: number, height: number, data: EventRawData[]) => {
    const dataConfig = initConfig(data);
    const options = initOptions(width, height);
    return { dataConfig, options };
};
