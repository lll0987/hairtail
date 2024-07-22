<template>
    <div
        v-show="show"
        :style="{ zIndex, ...transformStyles }"
        class="absolute top-0 left-0 right-0 h-0 z-auto pointer-events-none"
    >
        <div
            class="relative bg-zinc-800 bg-opacity-85 border-sky-400 border rounded-lg max-w-[80vw] w-max pointer-events-auto"
        >
            <div class="p-12 text-slate-50">
                <div v-if="loading" class="w-48 text-center">
                    <AgLoading :size="24"></AgLoading>
                </div>
                <ul v-else class="min-w-48">
                    <li v-for="item in settings" :key="item.id">
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
import { useTransform } from '../hooks';

const props = withDefaults(defineProps<{ show: boolean }>(), { show: false });
const show = computed(() => props.show);

const { nextZIndex } = useZIndex();
const zIndex = ref(0);
const transformStyles = ref({});

const toast = useToast();
const loading = ref(true);
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

watch(show, val => {
    if (!val) return;
    zIndex.value = nextZIndex();
    transformStyles.value = useTransform();
    getList();
});
</script>
