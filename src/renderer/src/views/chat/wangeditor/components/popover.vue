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
                        @dblclick="onSelected(item)"
                    >
                        <span>{{ item.label }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useZIndex } from '@renderer/hooks';
import { ISetting } from '@t/interface';
import { list } from '@renderer/api/setting';
import { AgLoading, useToast } from '@renderer/components';

const props = withDefaults(
    defineProps<{ modelValue: ISetting | null; show?: boolean; left?: number; top?: number; text: string }>(),
    { show: false, left: 0, top: 0 }
);
const emits = defineEmits(['update:modelValue', 'selected']);

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

// 显示隐藏
const show = ref(props.show);
const open = () => {
    // 显示时获取数据和层级
    getList();
    zIndex.value = nextZIndex();
    // 重置选中数据
    selected.value = props.modelValue;
    // 打开弹窗
    show.value = true;
};
const close = () => {
    show.value = false;
};
watch(
    () => props.show,
    val => {
        if (val === show.value) return;
        if (val) open();
        else close();
    }
);

// 选中的数据
const selected = ref<ISetting | null>(props.modelValue);
const updateSelected = (item: ISetting) => {
    selected.value = item;
    emits('update:modelValue', item);
};

// 选中ID，增加样式
const selectedId = computed(() => selected.value?.id ?? null);

// 过滤后的数据
const filterList = computed(() =>
    props.text ? settings.value.filter(item => item.label.includes(props.text)) : settings.value
);
// 监听文本变化，自动选中第一个
watch(
    () => props.text,
    value => {
        if (!value) {
            selected.value = null;
        }
        if (filterList.value.length) {
            updateSelected(filterList.value[0]);
        }
    }
);

// NEXT 增加方向键选择
// 选中
const onSelected = (item: ISetting) => {
    updateSelected(item);
    emits('selected', item);
};
</script>
