<template>
    <card>
        <template #title>快捷短语</template>
        <template #form>
            <create @refresh="getList"></create>
        </template>
        <div grid="~ cols-1 md:cols-2 lg:cols-3 xl:cols-4 flow-row-dense auto-rows-max" gap="3">
            <div v-for="item in settings" :key="item.id" class="bdr rounded">
                <div class="bdr-b bg-white px-2 py-1.5">
                    <span class="decorative">{{ item.label }}</span>
                </div>
                <div
                    grid="~ cols-[auto_auto_1fr] rows-[repeat(3,_auto)]"
                    class="mx-2 my-1.5 overflow-y-auto scrollbar-small"
                >
                    <div flex="~ wrap col" class="gap-y-8 row-span-full max-h-30">
                        <ag-tag v-for="tag in item.value.tags" :key="tag" :name="tag" class="mr-2"></ag-tag>
                    </div>
                    <template v-if="item.value.topic">
                        <p class="flex justify-end text-zinc-500">主题：</p>
                        <p class="w-max font-semibold relative">
                            <span
                                bg="rose-300 opacity-75"
                                class="absolute top-[0.7em] w-full h-[0.6em] z-0 block"
                                :style="{ backgroundColor: topicMap.get(item.value.topic)?.color }"
                            ></span>
                            <span class="relative">{{ item.value.topic }}</span>
                        </p>
                    </template>
                    <template v-if="item.value.value">
                        <p class="flex justify-end text-zinc-500">数值：</p>
                        <p>{{ item.value.value }}</p>
                    </template>
                    <template v-if="item.value.text">
                        <p class="flex justify-end text-zinc-500">内容：</p>
                        <p>{{ item.value.text }}</p>
                    </template>
                </div>
            </div>
        </div>
    </card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ISetting } from '@contracts/interface';
import { useBaseApi, useTopic } from '@renderer/hooks';
import { AgTag, useToast } from '@renderer/components';
import Create from './create.vue';
import Card from '../card.vue';

const { topicMap } = useTopic();

const settings = ref<ISetting[]>([]);
const toast = useToast();
const { list } = useBaseApi<ISetting>('setting');
const getList = async () => {
    const [msg, data] = await list();
    if (msg) toast.error(msg);
    else settings.value = data;
};

onMounted(() => {
    getList();
});
</script>
