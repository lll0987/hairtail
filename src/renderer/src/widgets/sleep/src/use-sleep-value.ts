import { computed, reactive, ref, ToRefs } from 'vue';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { IEvent } from '@contracts/interface';
import { EVENT_GRAIN } from '@contracts/component';
import { useBaseApi } from '@renderer/hooks';
import { useToast } from '@renderer/components';
import { useDateStore } from '@renderer/store';
import { SleepProps } from '..';

dayjs.extend(duration);

export const useSleepValue = ({ topic, topic2 }: ToRefs<SleepProps>) => {
    const toast = useToast();
    const { timestamp, next, subscribe } = useDateStore();
    const { list, add, update } = useBaseApi('event');

    const events = ref<IEvent[]>([]);
    const getEvents = async () => {
        const topics = [topic.value, topic2?.value].filter(i => !!i);
        const [, data] = await list({
            $and: [
                { end: { $gte: timestamp.value } },
                { end: { $lte: next.value } },
                { topic: { $in: topics } }
            ]
        });
        events.value = data;
        updateTimeValue();
    };

    const sleep = computed(() => {
        const { length, length2, start, end, up } = events.value.reduce(
            (pre, cur) => {
                const l = cur.end - cur.start;
                if (cur.topic === topic.value) {
                    pre.length += l;
                    // 最早开始时间
                    if (!pre.start || cur.start < pre.start) pre.start = cur.start;
                    // 最晚结束时间
                    if (cur.end > pre.end) pre.end = cur.end;
                } else {
                    pre.length2 += l;
                    // 最晚时间
                    if (cur.end > pre.up) pre.up = cur.end;
                }
                return pre;
            },
            { length: 0, length2: 0, start: 0, end: 0, up: 0 }
        );
        const d = dayjs.duration(length);
        const d2 = dayjs.duration(length2);
        return {
            hour: d.hours(),
            minute: d.minutes(),
            length: length2 ? d2.format('H小时m分钟') : '',
            start,
            end,
            up
        };
    });

    const timeValue = reactive<{ start?: number; end?: number; up?: number }>({});
    const updateTimeValue = () => {
        timeValue.start = sleep.value.start;
        timeValue.end = sleep.value.end;
        timeValue.up = sleep.value.up;
    };

    const addOrUpdateWakeUp = () => {
        const topic = topic2?.value;
        if (!topic) return Promise.reject();
        const { end: start, up: end } = timeValue;
        if (!start || !end) return Promise.reject();
        const item = events.value.filter(e => e.topic === topic)[0];
        if (item && item.id) return update(item.id, { start, end });
        return add({ start, end, topic, grain: Number(EVENT_GRAIN.TIME_RANGE) });
    };
    const addSleep = () => {
        const { start, end, up } = timeValue;
        if (!start || !end) return Promise.reject();
        const docs = [{ start, end, topic: topic.value, grain: Number(EVENT_GRAIN.TIME_RANGE) }];
        if (up && topic2?.value) {
            docs.push({ start: end, end: up, topic: topic2.value, grain: Number(EVENT_GRAIN.TIME_RANGE) });
        }
        return add(docs);
    };
    const updateSleep = async () => {
        const { start, end } = timeValue;
        if (!start || !end) return [];
        const { id } = events.value.filter(e => e.topic === topic.value)[0];
        if (!id) return [];
        const [msg] = await update(id, { start, end });
        if (msg) return [msg];
        return await addOrUpdateWakeUp();
    };
    const updateSleepValue = async () => {
        if (!timeValue.start || !timeValue.end) return;
        const handler = events.value.length ? updateSleep : addSleep;
        const [msg] = await handler();
        if (msg) return toast.error(msg);
        getEvents();
    };

    subscribe(() => {
        getEvents();
    });
    return { sleep, timeValue, updateSleepValue, updateTimeValue };
};
