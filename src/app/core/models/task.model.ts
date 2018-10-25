export enum TaskStatus {
    PENDING,
    STARTED,
    COMPLETED
}

export class TaskModel {
    constructor(
        public title: string,
        public description: string,
        public status: TaskStatus,
        public order: number,
    ) {}
}
