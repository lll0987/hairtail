import { computed, ref } from 'vue';
import { ITopic } from '@contracts/interface';
import { SelectItem, useToast } from '@renderer/components';
import { useBaseApi } from '..';

const topicList = ref<ITopic[]>([]);
const topicMap = computed(() =>
    topicList.value.reduce((acc, cur) => acc.set(cur.name, cur), new Map<string, ITopic>())
);
const topicOptions = computed<SelectItem[]>(() =>
    topicList.value.map(({ name }) => ({ label: name, value: name }))
);

export const useTopic = () => {
    const { list, add, update, remove } = useBaseApi<ITopic>('topic');
    const toast = useToast();
    // 增 改
    const addOrUpdateTopic = async (topic: ITopic) => {
        const { id, ...data } = topic;
        const [msg] = id ? await update(id, data) : await add(data);
        if (msg) toast.error(msg);
        return !msg;
    };
    // 删
    const removeTopic = async (id: string) => {
        const [msg] = await remove(id);
        if (msg) toast.error(msg);
        return !msg;
    };
    // 查
    const refreshTopicList = async () => {
        const [msg, data] = await list();
        if (msg) toast.error(msg);
        else topicList.value = data;
    };

    return { topicList, topicMap, topicOptions, addOrUpdateTopic, removeTopic, refreshTopicList };
};
