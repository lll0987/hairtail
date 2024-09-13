<template>
    <toast-provider>
        <div app h-screen flex="~ col">
            <header grid="~ cols-[1fr_auto_auto]" items-center gap-4 p-3>
                <nav>
                    <ul flex items-center gap-2>
                        <li
                            v-for="(icon, index) in menu_icons"
                            :key="index"
                            menu-item
                            :class="index === actived ? 'menu-item-selected' : ''"
                            @click="actived = index"
                        >
                            <component :is="icon" />
                        </li>
                    </ul>
                </nav>
                <div flex gap-1>
                    <time flex items-center gap-2 :datetime="datetime">
                        <span>{{ tip_str }}{{ tip_str ? ',' : '' }}</span>
                        <b>{{ date_str }}</b>
                    </time>
                    <button type="button" arrow-button @click="handleLast">
                        <icon-chevron-left></icon-chevron-left>
                    </button>
                    <button type="button" arrow-button @click="handleNext">
                        <icon-chevron-right></icon-chevron-right>
                    </button>
                    <button type="button" day-button @click="handleToday">
                        <span>Today</span>
                    </button>
                </div>
                <button type="button" mode-button @click="updateMode()">
                    <icon-moon-filled v-if="mode === 'dark'"></icon-moon-filled>
                    <icon-sun-filled v-else></icon-sun-filled>
                </button>
            </header>
            <main flex-1>
                <component :is="components[actived]" />
            </main>
        </div>
    </toast-provider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
    IconChevronLeft,
    IconChevronRight,
    IconCalendarWeek,
    IconHome,
    IconLayout,
    IconSettings,
    IconSunFilled,
    IconMoonFilled
} from '@tabler/icons-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import { useDateStore, useModeStore } from '@renderer/store';
import { ToastProvider } from '@renderer/components';
import preview from '@renderer/views/preview';
import today from '@renderer/views/today';
import calendar from '@renderer/views/calendar';
import setting from '@renderer/views/setting';

const { mode, updateMode } = useModeStore();

const menu_icons = [IconHome, IconCalendarWeek, IconSettings, IconLayout];
const components = [today, calendar, setting, preview];
const actived = ref(0);

const { timestamp, last, next, updateDate } = useDateStore();
const datetime = computed(() => dayjs(timestamp.value).format('YYYY-MM-DD'));
const date_str = computed(() => dayjs(timestamp.value).locale('zh-cn').format('ddd, MMMD, YYYY'));
const date_ind = ref(0);
const tip_str = computed(() => ['前天', '昨天', '今天', '明天', '后天'][date_ind.value + 2]);
const handleLast = () => {
    updateDate(last.value);
    date_ind.value--;
};
const handleNext = () => {
    updateDate(next.value);
    date_ind.value++;
};
const handleToday = () => {
    updateDate(dayjs().valueOf());
    date_ind.value = 0;
};
</script>
