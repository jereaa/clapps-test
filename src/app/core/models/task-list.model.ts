import { TaskModel } from './task.model';

export class TaskListModel {
    constructor(
        public title: string,
        public description: string,
        public users: string[],
        public tasks: TaskModel[],
        public _id?: string
    ) {}
}
