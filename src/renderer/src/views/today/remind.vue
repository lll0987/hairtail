<template>
    <ul class="bg-white bdr rounded-lg px-3 py-2">
        <li v-for="item in remind" :key="item.id" class="marker">{{ item.msg }}</li>
    </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ICron } from '@contracts/interface';
import { useApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';

const toast = useToast();
const remind = ref<ICron[]>([]);
const getRemind = async () => {
    const [msg, data] = await useApi('cron', 'list:today')();
    if (msg) toast.error(msg);
    else remind.value = data as ICron[];
};
onMounted(() => {
    getRemind();
});
</script>
