import type { IRoute } from '@contracts/interface';

import {
    IconCirclePlusFilled,
    IconHomeFilled,
    IconLayoutFilled,
    IconSettingsFilled
} from '@tabler/icons-vue';
import IconCalendarWeekFilled from './icons/IconCalendarWeekFilled.vue';

import preview from '@renderer/views/preview';
import today from '@renderer/views/today';
import chat from '@renderer/views/chat';
import calendar from '@renderer/views/calendar';
import setting from '@renderer/views/setting';

export default [
    {
        key: 'today',
        label: '今日关注点',
        icon: IconHomeFilled,
        component: today
    },
    {
        key: 'chat',
        label: '记录',
        icon: IconCirclePlusFilled,
        component: chat
    },
    {
        key: 'calendar',
        label: '日历',
        icon: IconCalendarWeekFilled,
        component: calendar
    },
    {
        key: 'setting',
        label: '设置',
        icon: IconSettingsFilled,
        component: setting
    },
    {
        key: 'preview',
        label: '组件预览',
        icon: IconLayoutFilled,
        component: preview
    }
] as IRoute[];
