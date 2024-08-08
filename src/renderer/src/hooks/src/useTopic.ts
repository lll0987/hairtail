import { computed, ref } from 'vue';
import { ITopic } from '@t/interface';
import { list } from '@renderer/api/topic';
import { useToast } from '@renderer/components';

const topicList = ref<ITopic[]>([]);
const topicMap = computed(() =>
    topicList.value.reduce((acc, cur) => {
        acc.set(cur.name, cur);
        return acc;
    }, new Map<string, ITopic>())
);
const topicOptions = computed(() => topicList.value.map(tag => ({ label: tag.name, value: tag.name })));

export const useTopic = () => {
    const refreshTopicList = async () => {
        const [msg, data] = await list();
        if (msg) {
            useToast().error(msg);
        } else {
            topicList.value = data;
        }
    };

    return { topicList, topicMap, topicOptions, refreshTopicList };
};
