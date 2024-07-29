import { computed, ref } from 'vue';
import { ITag } from '@t/interface';
import { list } from '@renderer/api/tag';
import { useToast } from '@renderer/components';

const tagList = ref<ITag[]>([]);
const tagMap = computed(() =>
    tagList.value.reduce((acc, cur) => {
        acc.set(cur.name, cur);
        return acc;
    }, new Map<string, ITag>())
);

export const useTag = () => {
    const refreshTagList = async () => {
        const [msg, data] = await list();
        if (msg) {
            useToast().error(msg);
        } else {
            tagList.value = data;
        }
    };

    return { tagList, tagMap, refreshTagList };
};
