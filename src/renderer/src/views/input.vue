<template>
    <div class="grid grid-cols-1 grid-rows-[1fr_260px] gap-8 w-full h-full">
        <div>
            <div v-for="(item, index) in records" :key="index">
                <div class="flex flex-row items-center justify-end w-full">
                    <div class="rounded max-w-full bg-cyan-700 text-white">
                        {{ item.in }}
                    </div>
                </div>
                <div class="flex flex-row items-center justify-start w-full">
                    <div class="rounded max-w-full bg-white">
                        {{ item.out }}
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 grid-rows-[1fr_auto] border-t-2 border-zinc-950 gap-8 py-8">
            <FullTextarea v-model="text" class="mx-6"></FullTextarea>
            <div class="flex flex-row items-center justify-end">
                <PrimaryButton class="mr-16">保存</PrimaryButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IRecord } from '@t/interface';
import FullTextarea from '../components/textarea';
import PrimaryButton from '../components/button';

const records = ref<IRecord[]>([]);
const text = ref('');
</script>
