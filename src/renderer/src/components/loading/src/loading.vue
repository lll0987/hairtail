<template>
    <icon v-bind="props">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            class="animate-spin"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="opacity-25"
            ></circle>
            <g
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M20.31 15.44A9 9 0 0 0 12 3"></path>
            </g>
        </svg>
    </icon>
</template>

<script setup lang="ts">
import icon, { IconProps } from '../../icon';
const props = defineProps<IconProps>();
</script>
