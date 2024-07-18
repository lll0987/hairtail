<template>
    <div class="flex gap-16 m-16">
        <IButton>default</IButton>
        <IButton type="primary">primary</IButton>
        <IButton type="accent">accent</IButton>
        <IButton type="success">success</IButton>
        <IButton type="warning">warning</IButton>
        <IButton type="error">error</IButton>
    </div>
</template>

<script setup lang="ts">
import IButton from '@renderer/components/button';
</script>
