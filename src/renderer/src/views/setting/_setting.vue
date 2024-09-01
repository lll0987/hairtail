<template>
    <div
        grid="~ cols-1 md:cols-[1fr_2fr] md:rows-[3fr_2fr] flow-col"
        gap="4"
        p="4"
        class="w-full h-full overflow-y-auto"
    >
        <tag></tag>
        <topic></topic>
        <shortcut></shortcut>
        <cron></cron>
    </div>
</template>

<script setup lang="ts">
import tag from './tag.vue';
import topic from './topic.vue';
import cron from './cron.vue';
import shortcut from './shortcut/shortcut.vue';

import { useTag, useTopic } from '@renderer/hooks';
const { refreshTagList } = useTag();
const { refreshTopicList } = useTopic();
refreshTagList();
refreshTopicList();
</script>
