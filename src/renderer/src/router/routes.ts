import {
    AddCircle16Filled,
    AddCircle16Regular,
    CalendarRtl24Filled,
    CalendarRtl24Regular,
    Home20Filled,
    Home20Regular
} from '@vicons/fluent';

import calendar from '@renderer/views/calendar';
import input from '@renderer/views/input.vue';
import dashboard from '@renderer/views/dashboard.vue';

import { IRoute } from '@t/interface';

export default [
    {
        key: 'dashboard',
        label: '首页',
        icon: Home20Regular,
        iconFilled: Home20Filled,
        component: dashboard
    },
    {
        key: 'input',
        label: '记录',
        icon: AddCircle16Regular,
        iconFilled: AddCircle16Filled,
        component: input
    },
    {
        key: 'calendar',
        label: '日历',
        icon: CalendarRtl24Regular,
        iconFilled: CalendarRtl24Filled,
        component: calendar
    }
] as IRoute[];
