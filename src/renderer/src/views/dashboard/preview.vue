<template>
    <div class="flex flex-col gap-16 m-16">
        <div class="flex gap-16">
            <AgButton>default</AgButton>
            <AgButton type="primary">primary</AgButton>
            <AgButton type="accent">accent</AgButton>
            <AgButton type="success">success</AgButton>
            <AgButton type="warning">warning</AgButton>
            <AgButton type="error">error</AgButton>
        </div>
        <div class="flex gap-16 flex-wrap">
            <Message message="info"></Message>
            <Message type="success" message="success"></Message>
            <Message type="warning" message="warning"></Message>
            <Message type="error" message="error"></Message>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AgButton } from '@renderer/components';
import Message from '@renderer/components/toast/src/message.vue';
</script>
