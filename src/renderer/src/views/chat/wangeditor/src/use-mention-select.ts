import { provide, reactive, ref, ShallowRef } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { IDomEditor } from '@wangeditor/editor';
import type { ISetting } from '@contracts/interface';
import { KEYBOARD_EVENT } from '@contracts/component';
import { PopoverStyle, useBaseApi, useCursor, useId } from '@renderer/hooks';
import { SelectApiKey, SelectProps, SelectValue, useToast } from '@renderer/components';
import { useSelectFocus } from '@renderer/components/select/src/use-select-focus';
import { useSelectOptions } from '@renderer/components/select/src/use-select-options';
import { useSelectSelected } from '@renderer/components/select/src/use-select-selected';
import { IMention, IPureText, MENTION_EVENT } from '../plugin';
import { EditorEmits } from '..';

export const useMentionSelect = (editorRef: ShallowRef<IDomEditor | undefined>, emits: EditorEmits) => {
    // popover
    const popoverId = useId().next();
    const hidePopover = () => {
        const popover = document.getElementById(popoverId);
        popover?.hidePopover();
    };
    const showPopover = () => {
        getOptions();
        const popover = document.getElementById(popoverId);
        popover?.showPopover();
    };
    const popoverStyle = ref<PopoverStyle>({});
    const updatePosition = () => {
        const { x, y } = useCursor();
        popoverStyle.value.left = `${x + 4}px`;
        popoverStyle.value.top = `${y}px`;
    };
    const popoverState = ref<boolean>(false);
    const updateShow = (state: boolean) => {
        popoverState.value = state;
    };
    // options
    const selectProps = reactive<SelectProps>({ match: '', options: [] });
    const { matchOptions } = useSelectOptions(selectProps);
    const toast = useToast();
    const { list } = useBaseApi<ISetting>('setting');
    const settings = ref<ISetting[]>([]);
    const loading = ref<boolean>(false);
    const getOptions = async () => {
        loading.value = true;
        const [msg, data] = await list();
        loading.value = false;
        if (msg) toast.error(msg);
        else {
            settings.value = data;
            selectProps.options = data.map(({ label }) => ({ label, value: label }));
        }
    };
    // value
    const updateValue = (v: SelectValue) => {
        const val = v as string;
        const item = settings.value.find(item => item.label === val);
        if (!item) return;
        const { tags, text, topic, value } = item.value;
        const data: IMention = {
            tags: tags?.map(tag => ({ text: tag })) ?? [],
            text: [topic, value, text].reduce(
                (pre, cur) => (cur === undefined ? pre : pre.concat({ text: cur + '' })),
                [] as IPureText[]
            )
        };
        editorRef.value?.restoreSelection();
        editorRef.value?.emit(MENTION_EVENT.POSITIVE, data);
        selectProps.match = '';
    };
    // focus
    const { focusValue, handleArrowFocus, updateFoucus, isFocus } = useSelectFocus({ matchOptions });
    // selected
    const multiple = ref<boolean>(false);
    const { handleItemSelected } = useSelectSelected({ hidePopover, updateValue, focusValue, multiple });
    // api
    const isSelected = () => false;
    provide(SelectApiKey, {
        loading,
        matchOptions,
        updateShow,
        updateFoucus,
        isFocus,
        isSelected,
        handleItemSelected
    });

    // keyboard event
    const onKeydown = useThrottleFn((key: KEYBOARD_EVENT) => {
        if ([KEYBOARD_EVENT.UP, KEYBOARD_EVENT.DOWN].includes(key)) {
            handleArrowFocus(key);
        }
        if (key === KEYBOARD_EVENT.ENTER) {
            if (popoverState.value) {
                handleItemSelected();
            } else {
                emits('enter');
            }
        }
    }, 100);
    // insert event
    const onInsert = useThrottleFn((text: string) => {
        updatePosition();
        selectProps.match = text;
        if (text === '') showPopover();
    }, 500);
    // negative event
    const onNegative = () => {
        hidePopover();
    };

    return { onKeydown, onInsert, onNegative, popoverId, popoverStyle };
};
