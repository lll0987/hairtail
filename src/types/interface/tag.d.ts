export interface TagModel {
    name: string;
    color: string;
    c2?: string;
    alias?: string;
}

export interface ITag extends TagModel {
    id?: string;
}

export interface TagBody extends TagModel {}
