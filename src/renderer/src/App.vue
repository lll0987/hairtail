<template>
    <toast-provider>
        <div bg="slate-100" text="slate-950" flex="~ row" class="w-screen h-screen">
            <dock></dock>
            <div class="flex-1 w-full h-full">
                <component :is="activedComponent" />
            </div>
        </div>
    </toast-provider>
</template>

<script setup lang="ts">
import Dock from '@renderer/views/dock';
import { activedComponent } from '@renderer/router';
import { ToastProvider } from '@renderer/components';
</script>
