export interface TagModel {
    name: string;
    color: string;
    alias?: string;
}

export interface ITag extends TagModel {
    id?: string;
}

export interface TagBody extends TagModel {}
