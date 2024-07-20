<template>
    <div class="flex flex-col gap-16 m-16">
        <div class="flex gap-16">
            <IButton>default</IButton>
            <IButton type="primary">primary</IButton>
            <IButton type="accent">accent</IButton>
            <IButton type="success">success</IButton>
            <IButton type="warning">warning</IButton>
            <IButton type="error">error</IButton>
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
import IButton from '@renderer/components/button';
import Message from '@renderer/components/toast/src/message.vue';
</script>
