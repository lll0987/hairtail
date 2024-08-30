import { computed, ref } from 'vue';
import { ITag } from '@contracts/interface';
import { SelectItem, useToast } from '@renderer/components';
import { ColorMode, getDefaultColor, useBaseApi, useColor } from '..';

const tagList = ref<ITag[]>([]);
const tagMap = computed(() =>
    tagList.value.reduce((acc, cur) => acc.set(cur.name, cur), new Map<string, ITag>())
);
const tagOptions = computed<SelectItem[]>(() =>
    tagList.value.map(tag => ({ label: tag.name, value: tag.name }))
);

const tagMode = ref<ColorMode>('dark');
const defaultColor = computed(() => getDefaultColor(tagMode.value).color);

export const useTag = () => {
    const { list, add, update, remove } = useBaseApi<ITag>('tag');
    const toast = useToast();
    // 增 改
    const addOrUpdateTag = async (tag: ITag) => {
        const { id, ...data } = tag;
        if (data.c2 === defaultColor.value) data.c2 = undefined;
        const [msg] = id ? await update(id, data) : await add(data);
        if (msg) toast.error(msg);
        return !msg;
    };
    // 删
    const removeTag = async (id: string) => {
        const [msg] = await remove(id);
        if (msg) toast.error(msg);
        return !msg;
    };
    // 查
    const refreshTagList = async () => {
        const [msg, data] = await list();
        if (msg) toast.error(msg);
        else tagList.value = data;
    };

    // 设置颜色模式
    const setColorMode = (mode: ColorMode) => {
        tagMode.value = mode;
    };

    return { tagList, tagMap, tagOptions, addOrUpdateTag, removeTag, refreshTagList, setColorMode };
};

/**
 * 获取标签渲染配置
 * @param name 标签名称
 * @param component 是否为组件，默认 true
 */
// @unocss-include
export const useTagRender = (name: string, component = true) => {
    const tag = tagMap.value.get(name);
    const type = 'span';
    const children = name;
    const props: { class?: string[]; style: Partial<CSSStyleDeclaration> } = {
        style: useColor(tag?.color, tag?.c2)
    };
    if (component) {
        props.class = [
            'inline-flex',
            'items-center',
            'flex-nowrap',
            'whitespace-nowrap',
            'box-border',
            'cursor-default',
            'leading-none',
            'text-3.5',
            'px-2',
            'py-1.5',
            'border',
            'border-slate-950',
            'rounded'
        ];
    } else {
        Object.assign(props.style, {
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            cursor: 'default',
            lineHeight: '1',
            fontSize: '0.875rem',
            padding: '0.5rem 0.375rem',
            border: '#020617 1px solid',
            borderRadius: '0.25rem'
        });
    }
    return { type, props, children };
};
