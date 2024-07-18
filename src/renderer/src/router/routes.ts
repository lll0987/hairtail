import {
    AddCircle16Filled,
    AddCircle16Regular,
    CalendarRtl24Filled,
    CalendarRtl24Regular,
    Home20Filled,
    Home20Regular
} from '@vicons/fluent';

import calendar from '@renderer/views/calendar';
import chat from '@renderer/views/chat';
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
        key: 'chat',
        label: '记录',
        icon: AddCircle16Regular,
        iconFilled: AddCircle16Filled,
        component: chat
    },
    {
        key: 'calendar',
        label: '日历',
        icon: CalendarRtl24Regular,
        iconFilled: CalendarRtl24Filled,
        component: calendar
    }
] as IRoute[];
