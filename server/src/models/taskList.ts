import * as mongoose from 'mongoose';
import { ITaskModel, taskSchema } from './task';

const Schema = mongoose.Schema;

export interface ITaskListModel extends mongoose.Document {
    title: string;
    description: string;
    userIds: string[];
    tasks: ITaskModel[];
}

const taskListSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userIds: { type: [String], required: true },
    tasks: { type: [taskSchema], required: false, default: null }
});

export const TaskListSchema = mongoose.model<ITaskListModel>('taskList', taskListSchema);
