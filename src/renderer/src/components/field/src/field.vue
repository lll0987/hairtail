<template>
    <div grid="~ cols-[auto_1fr] rows-[auto_auto]" items="center">
        <label :for="id" class="text-nowrap" :class="label ? 'mr-1.5' : ''">{{ label }}</label>
        <div
            ref="triggerRef"
            flex="~ row"
            class="bdr-all"
            :class="[
                'bg-' + (status ? getStatusColor(status, '100') : 'white'),
                'field-' + (size || 'default')
            ]"
        >
            <slot :id="id"></slot>
        </div>
        <p
            class="text-xs leading-none col-start-2"
            :class="[{ 'mt-1': feedback }, status ? 'text-' + getStatusColor(status) : '']"
        >
            {{ feedback }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { getStatusColor } from '@contracts/component';
import { PopoverStyle, useId, usePopover } from '@renderer/hooks';
import type { FieldProps } from '..';

defineOptions({ inheritAttrs: false });
// id
const id = useId().next();
// props
const props = defineProps<FieldProps>();
const { label, feedback, status, size } = toRefs(props);
// popover style
const triggerRef = ref<HTMLDivElement | null>(null);
const styles = usePopover(triggerRef);
const emits = defineEmits<{ (e: 'provide', value: PopoverStyle): void }>();
watch(styles, value => emits('provide', value), { immediate: true });
</script>
