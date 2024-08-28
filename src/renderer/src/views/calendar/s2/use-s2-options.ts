import { EXTRA_FIELD, S2Options } from '@antv/s2';
import { EVENT_GRAIN } from '@contracts/component';
import { useCalendarState } from '../use-calendar-state';
import { DateColCell, ShapeCornerCell, ShapeDataCell, TimeRowCell } from './cells';

// NEXT 日历 tooltip

export const useS2Options = (): S2Options => {
    const { state } = useCalendarState();

    return {
        width: state.width.client,
        height: state.height.client,
        style: {
            colCell: {
                width: state.width.col,
                height: state.height.col,
                heightByField: { [EXTRA_FIELD]: 0 }
            },
            rowCell: {
                width: state.width.row,
                height: state.height.row,
                heightByField: {
                    [`root[&]${EVENT_GRAIN.DATE}`]: state.height.line,
                    [`root[&]${EVENT_GRAIN.DATE_RANGE}`]: state.height.bar
                }
            }
        },
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
