<template>
    <div class="flex flex-wrap gap-2">
        <ag-button size="small">button</ag-button>
        <ag-button>按钮</ag-button>
        <ag-button size="large">button</ag-button>
        <ag-button loading>button</ag-button>
        <ag-button status="primary">button</ag-button>
        <ag-button status="accent">button</ag-button>
        <ag-button status="success">button</ag-button>
        <ag-button status="error">button</ag-button>
        <ag-button status="warning">button</ag-button>
    </div>
</template>

<script setup lang="ts">
import { AgButton } from '@renderer/components';
</script>
