export interface TopicModel {
    name: string;
    color: string;
}

export interface ITopic extends TopicModel {
    id?: string;
}

export interface TopicBody extends TopicModel {}
