export enum TaskStatus {
    PENDING = 0,
    STARTED,
    COMPLETED
}

export interface ITaskStatusStrings { [id: number]: string; }
export const TASK_STATUS_STRINGS: ITaskStatusStrings = {
    0: 'Pending',
    1: 'Started',
    2: 'Completed'
};

export class TaskModel {
    constructor(
        public title: string,
        public description: string,
        public status: TaskStatus = TaskStatus.PENDING,
        public order: number = 0,
        public _id?: string
    ) {}
}

