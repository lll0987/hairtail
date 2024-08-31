<template>
    <div class="flex flex-wrap gap-2">
        <ag-input size="small"></ag-input>
        <ag-input></ag-input>
        <ag-input size="large"></ag-input>
        <ag-input parse="number"></ag-input>
        <ag-input status="error"></ag-input>
        <ag-input status="success"></ag-input>
        <ag-input status="warning"></ag-input>
    </div>
    <div class="flex flex-wrap gap-2">
        <ag-select size="small"></ag-select>
        <ag-select :options="options"></ag-select>
        <ag-select size="large"></ag-select>
        <ag-select :options="options" multiple></ag-select>
        <ag-select status="error"></ag-select>
        <ag-select status="success"></ag-select>
        <ag-select status="warning"></ag-select>
    </div>
    <div class="flex flex-wrap gap-2">
        <ag-cron-picker size="small"></ag-cron-picker>
        <ag-cron-picker></ag-cron-picker>
        <ag-cron-picker size="large"></ag-cron-picker>
        <ag-cron-picker status="error"></ag-cron-picker>
        <ag-cron-picker status="success"></ag-cron-picker>
        <ag-cron-picker status="warning"></ag-cron-picker>
    </div>
    <div class="flex flex-wrap gap-2">
        <ag-color-picker></ag-color-picker>
    </div>
</template>

<script setup lang="ts">
import { AgColorPicker, AgCronPicker, AgInput, AgSelect } from '@renderer/components';

const options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' }
];
</script>
