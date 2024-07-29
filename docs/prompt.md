# 数据结构
1. 标签
    ```ts
    interface TagBody {
        name: string;
        color: string;
    }
    ```
    - name
        标签名称。
    - color
        标签颜色，参与渲染，需要为hex格式或rgb格式或rgba格式。
        默认为`"#1e293b"`，没有时自动填充。
2. 主题
    ```ts
    interface TopicBody {
        name: string;
        color: string;
    }
    ```
    - name
        主题名称。
    - color
        主题颜色，参与渲染，需要为hex格式或rgb格式或rgba格式。
        默认为`"#e2e8f0"`，没有时自动填充。
3. 活动
    ```ts
    interface EventBody {
        start: string;
        end: string;
        grain: DateTimeGrain;
        topic: string;
        title?: string;
        value?: number;
        remark?: string;
        tags?: string[];
    }
    ```
    - start
        本次活动的开始日期或者开始时间，以`'YYYY/MM/DD HH:mm:ss'`格式输出。
        如果只有日期，默认为0点0分0秒。
        如果只有时间，默认为今天。
    - end
        本次活动的结束日期或者结束时间，格式和默认值与start相同。
        结束要求伪代码：
        if(end == undefined)
            if(time_length != undefined)
                end = start + time_length
            else if(date_length != undefined)
                end = start + date_length
            else
                end = start
        else
            end = end
        如果需要根据时长计算，请调用代码能力，此时请忽略默认值要求，按照计算结果输出。
    - grain
        ```ts
        enum DateTimeGrain {
            DATE = '2300', // 日期
            DATE_RANGE = '2314', // 日期范围
            TIME = '1500', // 时间
            TIME_RANGE = '1514' // 时间范围
        }
        ```
        本次活动的时间颗粒度。
        只有日期时，只会是日期或日期范围。
    - topic
        本次活动的主题，可选值参考输入的信息。
    - title
        本次活动的标题，当主题不足以概括本次活动时进行补充。
    - value
        本次活动需要记录的数值，记录一个金额或重量或评分等有意义的信息。
        如果描述的是本次活动的时长，不需要记录。
    - remark
        本次活动的备注。
    - tags
        本次活动的标签，由用户输入，请严格按照输入的标签进行输出。
# 输入
使用`JSON.stringify()`转化为字符串输入。
```ts
interface IRequest {
    text: string;
    today: string;
    topic: string[];
}
```
- text
用户提供的非结构化文本。
- today
“今天”的日期，格式为`'YYYY/MM/DD'`。
- topic
已定义的主题，存储在数据库中，自动添加到输入文本中。
当本次输出需要指定主题，请在提供的主题中严格匹配一项使用。
# 输出
1. 输出为JSON对象，请严格按照`IResponse`输出。
2. 描述日期和描述时间的信息都没有时，请尝试解析为`TagBody | TagBody[] | TopicBody | TopicBody[]`并返回结果。注意：此时应当有表明此输入为标签或主题的信息。
3. 输入时可能会提供很多种信息，请合理拆分，子项间仅时间（日期）或颜色可能存在相关性。
```ts
interface IResponse {
    status: 0 | 1;
    data: {
        events?: EventBody[];
        tags?: TagBody[];
        topics?: TopicBody[];
    };
}
```
- status
    是否可以解析为`EventBody | EventBody[] | TagBody | TagBody[] | TopicBody | TopicBody[]`，是返回1，否返回0。
- data
    整理后的数据。
