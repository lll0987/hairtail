import dayjs from 'dayjs';
import { IEvent } from '@t/interface';
import { DateTimeGrain } from '@t/enum';

const random = (length: number) => Number((Math.random() * length).toFixed(0));

const generateData = () => {
    const data: IEvent[] = [];

    for (let m = 0; m < 7; m++) {
        let day = dayjs().year(2024).date(1).month(m).hour(0).minute(0).second(0).millisecond(0);
        const days = day.daysInMonth();
        const random_date = random(days);

        for (let d = 0; d < days; d++) {
            day = day.date(d + 1);

            if (d !== random_date) {
                const d0 = day.valueOf();
                data.push({ start: d0, end: d0, grain: DateTimeGrain.DATE, value: random(4) + 1 });

                const d1 = day
                    .minute(random(59))
                    .hour(random(5) + 12)
                    .valueOf();
                data.push({ start: d1, end: d1, grain: DateTimeGrain.TIME, value: random(49) + 1 });
            }

            day = day.minute(random(59)).hour(random(2));
            data.push({
                start: day.valueOf(),
                end: day
                    .add(random(2) + 6, 'hour')
                    .add(random(59), 'minute')
                    .valueOf(),
                grain: DateTimeGrain.TIME_RANGE
            });
        }
    }

    return data;
};

export default generateData();
