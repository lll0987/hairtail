<!-- 预设 -->
<template>
    <div
        class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-flow-row-dense auto-rows-max gap-16 p-16 w-full h-full overflow-y-auto"
    >
        <!-- <div class="flex flex-row items-center gap-8 col-span-full"> -->
        <!-- 名称 输入框 -->
        <!-- 标签 选择框 联动显示主题选择框 -->
        <!-- 数值 输入框（限制数字） -->
        <!-- <AgButton type="primary" @click="handleCreate">新增</AgButton> -->
        <!-- </div> -->
        <div v-for="item in settings" :key="item.id" class="border-2 border-slate-800 rounded">
            <div class="border-b-2 border-slate-800 bg-white px-12 py-6">
                <AgTitle>{{ item.label }}</AgTitle>
            </div>
            <div class="grid grid-cols-[auto_auto_1fr] grid-rows-[repeat(3,_auto)] px-8 py-6">
                <div class="flex flex-col flex-wrap gap-y-8 row-span-full max-h-110">
                    <span
                        v-for="tag in item.value.tags"
                        :key="tag"
                        class="rounded border border-slate-950 bg-slate-800 text-slate-100 text-14 px-6 py-4 mr-8"
                    >
                        {{ tag }}
                    </span>
                </div>
                <template v-if="item.value.topic">
                    <p class="flex justify-end text-zinc-500">主题：</p>
                    <p
                        class="w-max font-semibold after:bg-rose-300 after:bg-opacity-75 after:w-full after:h-[0.6em] after:mt-[-0.8em] after:block"
                    >
                        {{ item.value.topic }}
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ISetting } from '@t/interface';
import { create, list } from '@renderer/api/setting';
import { AgButton, AgTitle, useToast } from '@renderer/components';

const toast = useToast();

const settings = ref<ISetting[]>([]);
const getList = async () => {
    const [msg, data] = await list();
    if (msg) {
        toast.error(msg);
    } else {
        settings.value = data;
    }
};

onMounted(() => {
    getList();
});

const handleCreate = async () => {
    // await create();
    getList();
};
</script>
