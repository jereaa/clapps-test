export enum TaskStatus {
    PENDING,
    STARTED,
    COMPLETED
}

export interface ITaskStatusStrings { [id: number]: string; }

export class TaskModel {
    constructor(
        public title: string,
        public description: string,
        public status: TaskStatus = TaskStatus.PENDING,
        public order: number = 0,
        public _id?: string
    ) {}
}
