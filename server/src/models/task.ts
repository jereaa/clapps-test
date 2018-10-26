import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface ITaskModel extends mongoose.Document {
    title: string;
    description: string;
    status: number;
    order: number;
}

export const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: false, default: 0 },
    order: { type: Number, required: false, default: 0 }
});

// export const TaskSchema = mongoose.model<ITaskModel>('task', taskSchema);
