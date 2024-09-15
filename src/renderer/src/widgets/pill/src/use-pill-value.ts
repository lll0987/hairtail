import { computed, ref, ToRefs } from 'vue';
import { IEvent, IInfo } from '@contracts/interface';
import { EVENT_GRAIN } from '@contracts/component';
import { useBaseApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';
import { useDateStore } from '@renderer/store';
import { PillProps } from '..';

export const usePillValue = ({ tag, topic, length }: ToRefs<PillProps>) => {
    const toast = useToast();
    const { timestamp, subscribe } = useDateStore();
    const { list: listI, update: updateI } = useBaseApi('info');
    const { list: listE, add: addE, update: updateE } = useBaseApi('event');

    const info = ref<IInfo>();
    const infoOptions = ref<IInfo[]>([]);
    const getInfo = async () => {
        const [, data] = await listI({ tag: tag.value });
        if (data.length < 1) infoOptions.value = [];
        else infoOptions.value = data;
        info.value = infoOptions.value[0];
    };

    const event = ref<IEvent>();
    const getEvent = async () => {
        const [, data] = await listE({
            $and: [{ start: { $gte: timestamp.value } }, { tags: { $in: [tag.value] } }]
        });
        if (data.length !== 1) return;
        event.value = data[0];
        updateTimeValue();
    };

    const timeValue = ref<number>();
    const updateTimeValue = () => {
        timeValue.value = event.value?.start;
    };

    const addPill = async (start: number, end: number) => {
        // 新增日程
        const [msg] = await addE({
            grain: Number(EVENT_GRAIN.TIME_RANGE),
            topic: topic.value,
            start,
            end,
            tags: [tag.value]
        });
        if (msg) return toast.error(msg);
        // 更新数量
        const { id, value } = info.value!;
        if (!id || !value) return toast.error('药物信息不合法');
        const [m] = await updateI(id, { value: value - 1 });
        if (m) return toast.error(m);
        getEvent();
        getInfo();
    };
    const updatePill = async (start: number, end: number) => {
        if (!event.value?.id) return;
        const [msg] = await updateE(event.value.id, { start, end });
        if (msg) return toast.error(msg);
        getEvent();
    };
    const updatePillValue = async () => {
        if (!timeValue.value) return;
        const start = timeValue.value;
        const end = start + (length?.value || 0);
        if (event.value?.id) await updatePill(start, end);
        else await addPill(start, end);
    };

    const pill = computed(() => {
        const { value, total } = info.value || {};
        return { current: value || 0, total: total || 0 };
    });

    const pillOptions = computed(() => infoOptions.value.map(({ name }) => ({ label: name, value: name })));
    const selectedPill = (value: string) => {
        const item = infoOptions.value.find(i => i.name === value);
        info.value = item;
    };

    subscribe(() => {
        getInfo();
        getEvent();
    });
    return { pill, pillOptions, timeValue, selectedPill, updatePillValue, updateTimeValue };
};
