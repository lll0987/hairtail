<template>
    <button
        ref="triggerRef"
        class="reset-all bdr-all"
        :cursor="readonly ? 'default' : 'pointer'"
        :w="size === undefined ? '6' : size === 'large' ? '8' : '4'"
        :h="size === undefined ? '6' : size === 'large' ? '8' : '4'"
        :style="{ background: mergedValue }"
        :popovertarget="id"
        :disabled="readonly"
    >
        <div :id="id" popover class="m-0 p-1.5 bg-white bdr-all" :style="{ ...styles }">
            <div grid="~ rows-11 cols-[repeat(18,_minmax(0,_1fr))] flow-col" gap="1.5">
                <template v-for="name in colorNames" :key="name">
                    <div
                        v-for="shade in shades"
                        :key="shade"
                        :style="{ backgroundColor: colors[name][shade] }"
                        class="rounded-md cursor-pointer w-5 h-5"
                        @click="onClick(colors[name][shade])"
                    ></div>
                </template>
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
import { colors, shades } from '@contracts/component';
import { useId, useModelValue, usePopover } from '@renderer/hooks';
import type { ColorPickerEmits, ColorPickerProps } from '..';
import { colorNames } from './color-name';
import { ref, toRef } from 'vue';

// id
const id = useId().next();
// style
const triggerRef = ref<HTMLElement | null>(null);
const styles = usePopover(triggerRef, false);
// props & emits
const props = withDefaults(defineProps<ColorPickerProps>(), { defaultValue: '' });
const emits = defineEmits<ColorPickerEmits>();
// readonly & size
const readonly = toRef(props, 'readonly');
const size = toRef(props, 'size');
// value
const { mergedValue, updateValue } = useModelValue(props, emits);
const onClick = (color: string) => {
    updateValue(color);
    const popover = document.getElementById(id);
    popover?.hidePopover();
};
</script>
