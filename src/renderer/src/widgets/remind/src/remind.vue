<template>
    <ul widget-auto border-auto border-2 p-4>
        <li v-for="item in remind" :key="item.id" marker mb-2>{{ item.msg }}</li>
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { TResponse } from '@contracts/type';
import type { ICron } from '@contracts/interface';
import { useApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';

const toast = useToast();
const remind = ref<ICron[]>([]);
const getRemind = async () => {
    const [msg, data] = (await useApi('cron', 'list:today')()) as TResponse<ICron, true>;
    if (msg) toast.error(msg);
    else remind.value = data as ICron[];
};
getRemind();
</script>
