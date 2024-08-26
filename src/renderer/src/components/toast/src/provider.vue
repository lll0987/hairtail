<!-- MEMO Toast.Z = 3000 -->
<!-- MEMO Toast.top = 16px -->
<template>
    <div>
        <slot></slot>
        <teleport to="body">
            <div
                flex="~ col"
                items="center"
                gap="3"
                class="z-[3000] top-[16px] fixed left-0 right-0 h-0 overflow-visible"
            >
                <Message v-for="item in messageList" :key="item.id" v-bind="item.options"></Message>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { MessageProps, ToastApi, ToastApiInjectionKey } from '..';
import Message from './message.vue';

interface IMessage {
    id: string;
    timer: number | null;
    options: MessageProps;
}

let seed = 0;
const getId = () => `message-${seed++}`;

// MEMO Toast.duration = 3000
const defaultDuration = 3000;

const messageList = ref<IMessage[]>([]);

/**
 * 隐藏 Toast
 * @param id
 */
const close = (id: string) => {
    const index = messageList.value.findIndex(message => message.id === id);

    let { timer } = messageList.value[index];
    if (timer) {
        window.clearTimeout(timer);
        timer = null;
    }

    messageList.value.splice(index, 1);
};

/**
 * 创建 Toast
 * @param options
 */
const create = (options: MessageProps) => {
    const id = getId();

    const { duration = defaultDuration } = options;
    const timer = window.setTimeout(() => close(id), duration);

    messageList.value.push({ id, timer, options });
};

const api: ToastApi = {
    info: (message: string) => create({ message }),
    success: (message: string) => create({ message, status: 'success' }),
    warning: (message: string) => create({ message, status: 'warning' }),
    error: (message: string) => create({ message, status: 'error' })
};

provide(ToastApiInjectionKey, api);
</script>
