import { computed, ComputedRef, reactive } from 'vue';
import BigNumber from 'bignumber.js';

const hour_count_arr = [24, 12, 6, 3];

const scroll_bar_size = 16;
const col_width = 100;
const col_height = 80;
const row_width = 60;
const row_height = 30;
const chart_row_height = 100;

interface IState {
    width: {
        client: number;
        col: number;
        row: number;
    };
    height: {
        client: number;
        col: number;
        row: ComputedRef<number>;
        bar: number;
        line: ComputedRef<number>;
        data: ComputedRef<number>;
    };
    date: {
        format: string;
        start: string;
        end: string;
        count: ComputedRef<number>;
    };
    hour: {
        format: string;
        length: number;
        start: number;
        end: ComputedRef<number>;
        count: ComputedRef<number>;
        span: ComputedRef<number>;
    };
}

const state = reactive<IState>({
    // NEXT 列宽根据总宽度计算
    width: {
        client: 0,
        col: col_width,
        row: row_width
    },
    height: {
        client: 0,
        col: col_height,
        row: computed(() => {
            const { data: height } = state.height;
            if (height <= 0) return row_height;
            const { length } = state.hour;
            return new BigNumber(height).idiv(length).toNumber();
        }),
        // NEXT 根据日历数据计算日期范围行的高度
        bar: row_height,
        line: computed(() => {
            const { data: height, row } = state.height;
            const { length } = state.hour;
            const gap = height > 0 ? height - row * length : 0;
            return chart_row_height + gap;
        }),
        data: computed<number>(() => {
            const { client: height, bar } = state.height;
            return height > 0 ? height - scroll_bar_size - col_height - chart_row_height - bar : 0;
        })
    },
    date: {
        format: 'YYYY-MM-DD',
        start: '2023-01-01',
        end: '2024-12-31',
        count: computed(() => {
            const { client: width, col, row } = state.width;
            return new BigNumber(width).minus(row).idiv(col).toNumber();
        })
    },
    hour: {
        format: 'HH:mm',
        length: 24,
        start: 0,
        end: computed<number>(() => (state.hour.start || state.hour.length) - 1),
        count: computed(() => {
            const height = state.height.data;
            if (height <= 0) return hour_count_arr[0];
            return hour_count_arr.find(item => height > item * row_height) || hour_count_arr[0];
        }),
        span: computed<number>(() => state.hour.length / state.hour.count)
    }
});

export const useCalendarState = () => {
    const isFirstHour = (hour: number): boolean => (hour * state.hour.count) % state.hour.length === 0;
    const isLastHour = (hour: number): boolean =>
        state.hour.count === state.hour.length || isFirstHour(hour + 1);
    return { state, isFirstHour, isLastHour };
};
