<template>
    <toast-provider>
        <div bg="gray-300 dark:neutral-800" text="gray-950 dark:white" flex="~ col" h-screen>
            <header grid="~ cols-[1fr_auto_auto]" items-center gap-4 p-2>
                <nav>
                    <ul flex gap-2>
                        <li
                            v-for="(icon, index) in menu_icons"
                            :key="index"
                            :class="{ border: index === actived }"
                            w-10
                            h-8
                            px-2
                            py-1
                            @click="actived = index"
                        >
                            <component :is="icon" />
                        </li>
                    </ul>
                </nav>
                <div flex gap-1>
                    <time :datetime="datetime">
                        <span text-sm mr-2>{{ tip_str }}</span>
                        <b>{{ date_str }}</b>
                    </time>
                    <button type="button" bg-transparent border w-6 h-6 p-1.5 @click="handleLast">
                        <icon-chevron-left></icon-chevron-left>
                    </button>
                    <button type="button" bg-transparent border w-6 h-6 p-1.5 @click="handleNext">
                        <icon-chevron-right></icon-chevron-right>
                    </button>
                    <button
                        type="button"
                        bg-transparent
                        border
                        rounded-3xl
                        px-2
                        h-6
                        flex
                        items-center
                        @click="handleToday"
                    >
                        <span text-xs>Today</span>
                    </button>
                </div>
                <div>
                    <button type="button" bg-transparent border w-8 h-8 p-1.5 @click="updateMode()">
                        <icon-moon v-if="mode === 'dark'"></icon-moon>
                        <icon-sun v-else></icon-sun>
                    </button>
                </div>
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
    IconSun,
    IconMoon
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
const date_str = computed(() => dayjs(timestamp.value).locale('zh-cn').format('ddd, MMMD日, YYYY'));
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
