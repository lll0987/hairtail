export interface InfoModel {
    name: string;
    att?: string;
    remark?: string;
}

export interface IInfo extends InfoModel {
    id?: string;
}

export interface InfoBody extends Omit<InfoModel, 'att'> {}
