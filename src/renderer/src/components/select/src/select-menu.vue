<template>
    <div
        :id="id"
        ref="popoverRef"
        popover
        w="min-12 max-[80vw]"
        h="max-52"
        bg="white"
        class="scrollbar-small bdr-all m-0 p-1.5 overflow-y-auto"
    >
        <div v-if="loading" class="text-center cursor-wait">
            <IconLoader2 size="1.5rem" class="animate-spin"></IconLoader2>
        </div>
        <menu v-else class="w-full h-full flex flex-col gap-1">
            <li
                v-for="(item, index) in matchOptions"
                :key="item.value"
                class="px-1.5 py-1 rounded cursor-pointer relative"
                :class="isFocus(index) ? ['bg-slate-200', 'text-lime-500'] : ''"
                @click.stop="handleItemSelected(item)"
                @dblclick.stop="handleItemSelected(item)"
                @mouseenter.stop="updateFoucus(index)"
            >
                <input
                    class="absolute inset-0 opacity-0 cursor-[inherit]"
                    type="radio"
                    :name="id"
                    :value="item.value"
                />
                <span>{{ item.label }}</span>
            </li>
        </menu>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, toRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { IconLoader2 } from '@tabler/icons-vue';
import { SelectApiKey } from '..';

// id
const props = defineProps<{ id: string }>();
const id = toRef(props, 'id');

// MEMO select-menu 不单独使用，必须 provide api
const { loading, matchOptions, handleItemSelected, updateShow, updateFoucus, isFocus } = inject(
    SelectApiKey,
    {
        loading: ref(true),
        matchOptions: computed(() => []),
        updateShow: () => {},
        updateFoucus: () => {},
        isFocus: () => false,
        handleItemSelected: () => {}
    }
);

// state
const popoverRef = ref<HTMLDivElement | null>(null);
useEventListener(popoverRef, 'toggle', e => {
    const event = e as ToggleEvent;
    updateShow(event.newState === 'open');
});
</script>
