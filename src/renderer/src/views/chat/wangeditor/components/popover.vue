<template>
    <div
        v-show="show"
        :style="{ zIndex, ...transformStyles }"
        class="absolute top-0 left-0 right-0 h-0 z-auto pointer-events-none"
    >
        <div
            class="relative bg-zinc-800 bg-opacity-85 border-sky-400 border rounded-lg max-w-[80vw] w-max pointer-events-auto"
        >
            <div class="p-6 text-slate-50">
                <div v-if="loading" class="w-48 text-center">
                    <AgLoading :size="24"></AgLoading>
                </div>
                <ul v-else class="min-w-48">
                    <li
                        v-for="item in filterList"
                        :key="item.id"
                        class="my-4 py-4 px-6 bg-opacity-10 bg-slate-50 rounded"
                        :style="selectedId !== item.id ? { background: 'transparent' } : ''"
                        @click="onSelected(item)"
                    >
                        <span>{{ item.label }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import { useZIndex } from '@renderer/hooks';
import { ISetting } from '@t/interface';
import { list } from '@renderer/api/setting';
import { AgLoading, useToast } from '@renderer/components';

const props = withDefaults(defineProps<{ show: boolean; left: number; top: number; text: string }>(), {
    show: false,
    left: 0,
    top: 0,
    text: ''
});
const emits = defineEmits(['change', 'selected']);

// 显示隐藏
const show = computed(() => props.show);

// 位置
const transformStyles = computed(() => ({
    transform: `translateX(${props.left}px) translateY(${props.top}px)`
}));
// 层级
const { nextZIndex } = useZIndex();
const zIndex = ref(0);

// 提示组件
const toast = useToast();
// 数据加载状态
const loading = ref(true);
// 全部数据
const settings = ref<ISetting[]>([]);
const getList = async () => {
    loading.value = true;
    const [msg, data] = await list();
    loading.value = false;
    if (msg) {
        toast.error(msg);
    } else {
        settings.value = data;
    }
};
// 过滤后的数据
const filterList = computed(() =>
    props.text ? settings.value.filter(item => item.label.includes(props.text)) : settings.value
);

// 选中的数据
const selected = ref<ISetting>();
// 选中ID，增加样式
const selectedId = computed(() => selected.value?.id ?? '');
const changeSelected = (item: ISetting) => {
    selected.value = item;
    emits('change', selected.value);
};
const onSelected = (item: ISetting) => {
    changeSelected(item);
    nextTick(() => {
        emits('selected');
    });
};
// 监听文本变化，自动选中第一个
watch(
    () => props.text,
    value => {
        if (!value) {
            selected.value = undefined;
        }
        if (filterList.value.length) {
            changeSelected(filterList.value[0]);
        }
    }
);
// NEXT 增加方向键选择和点击选中

// 监听显示状态，显示时获取数据和层级
watch(show, val => {
    if (!val) return;
    zIndex.value = nextZIndex();
    getList();
});
</script>
