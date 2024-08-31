<template>
    <div class="flex flex-col gap-4 p-4 w-full h-full">
        <div class="flex flex-wrap gap-2">
            <message message="info"></message>
            <message message="error" status="error"></message>
            <message message="success" status="success"></message>
            <message message="warning" status="warning"></message>
        </div>
        <preview-button></preview-button>
        <preview-field></preview-field>
    </div>
</template>

<script setup lang="ts">
import message from '@renderer/components/toast/src/message.vue';
import PreviewButton from './button.vue';
import PreviewField from './field.vue';
</script>
