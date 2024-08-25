<template>
    <div grid="~ cols-[auto_1fr] rows-[auto_auto]" gap="x-1.5 y-1" class="items-center">
        <label v-if="label" :for="id" class="text-nowrap">{{ label }}</label>
        <div
            ref="triggerRef"
            p="x-3 y-2"
            flex="~ row"
            class="bdr"
            :class="status === undefined ? 'bg-white' : getStatusColor(status, '100')"
        >
            <slot :id="id"></slot>
        </div>
        <p
            class="text-xs leading-none col-start-2"
            :class="status === undefined ? '' : getStatusColor(status)"
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
const { label, feedback, status } = toRefs(props);
// popover style
const triggerRef = ref<HTMLDivElement | null>(null);
const styles = usePopover(triggerRef);
const emits = defineEmits<{ (e: 'provide', value: PopoverStyle): void }>();
watch(styles, value => emits('provide', value), { immediate: true });
</script>
