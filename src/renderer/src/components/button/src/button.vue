<template>
    <button
        class="bg-pink-900 text-white border-2 border-zinc-950 rounded px-8 h-32 inline-flex flex-row justify-center items-center"
    >
        <span v-show="props.loading" class="flex items-center mr-6">
            <LoadingIcon size="1em"></LoadingIcon>
        </span>
        <span class="flex items-center flex-nowrap min-w-0">
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import LoadingIcon from '../../loading';

const props = withDefaults(defineProps<{ loading?: boolean }>(), { loading: true });
</script>
