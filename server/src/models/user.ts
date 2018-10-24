import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUserModel extends mongoose.Document {
    username: string;
}

const userSchema = new Schema({
    username: { type: String, required: true },
});

export const UserSchema = mongoose.model<IUserModel>('user', userSchema);
