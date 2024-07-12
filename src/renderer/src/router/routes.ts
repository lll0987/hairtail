import { CalendarEvent, Dashboard, Plus } from '@vicons/tabler';

import calendar from '@renderer/views/calendar.vue';
import input from '@renderer/views/input.vue';
import dashboard from '@renderer/views/dashboard.vue';

import { IRoute } from '@t/interface';

export default [
    {
        key: 'dashboard',
        label: '首页',
        icon: Dashboard,
        component: dashboard
    },
    {
        key: 'input',
        label: '记录',
        icon: Plus,
        component: input
    },
    {
        key: 'calendar',
        label: '日历',
        icon: CalendarEvent,
        component: calendar
    }
] as IRoute[];
