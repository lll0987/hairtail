import { defineComponent, PropType, reactive, ref, toRaw, toRef } from 'vue';
import { IconPencilCheck, IconTrash, IconX } from '@tabler/icons-vue';
import { useColor } from '@renderer/hooks';
import { AgColorPicker } from '@renderer/components';

export default defineComponent({
    props: {
        item: {
            type: Object as PropType<{ name: string; color: string; c2?: string; id?: string }>,
            required: true
        },
        accent: Boolean
    },
    emits: ['update', 'delete'],
    setup(props, { emit }) {
        const item = reactive(props.item);
        const accent = toRef(props, 'accent');

        const editing = ref(false);
        const onDbClick = () => {
            editing.value = true;
            window.getSelection()?.removeAllRanges();
        };
        const onCancel = () => {
            editing.value = false;
        };
        const onConfirm = () => {
            emit('update', toRaw(item), () => {
                editing.value = false;
            });
        };

        const onDelete = () => {
            emit('delete', toRaw(item));
        };

        return () => (
            <div
                p="x-3 y-2"
                flex="~ row"
                class="items-center gap-2 leading-none bg-white bdr rounded"
                style={accent.value && !editing.value && useColor(item.color, item.c2)}
                onDblclick={onDbClick}
            >
                {(editing.value || !accent.value) && (
                    <AgColorPicker
                        modelValue={item.color}
                        onUpdate:modelValue={v => (item.color = v)}
                        disabled={!editing.value}
                        size="small"
                    ></AgColorPicker>
                )}
                {editing.value && accent.value && (
                    <AgColorPicker
                        modelValue={item.c2}
                        onUpdate:modelValue={v => (item.c2 = v)}
                        disabled={!editing.value}
                        size="small"
                    ></AgColorPicker>
                )}
                <span class="cursor-default">{item.name}</span>
                {editing.value && (
                    <span class="flex items-center gap-1 pl-2 ml-1 -mr-1 border-l border-black">
                        <i flex="~ center" class="text-positive" {...{ onClick: onConfirm }}>
                            <IconPencilCheck size="1.25rem"></IconPencilCheck>
                        </i>
                        <i flex="~ center" class="text-danger" {...{ onClick: onDelete }}>
                            <IconTrash size="1.25rem"></IconTrash>
                        </i>
                        <i flex="~ center" class="text-negative" {...{ onClick: onCancel }}>
                            <IconX size="1.25rem"></IconX>
                        </i>
                    </span>
                )}
            </div>
        );
    }
});
