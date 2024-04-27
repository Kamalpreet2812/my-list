import mongoose, { Schema, Document } from 'mongoose';
type ItemType = 'movie' | 'tv_show';

interface UserList {
    userId: string;
    items: { contentId: string; type: ItemType }[];
}

const UserListSchema: Schema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
items: [{ contentId: { type: String, required: true }, type: { type: String, required: true } }],
});

// Create a unique compound index on userId and items.contentId
UserListSchema.index({ userId: 1, 'items.contentId': 1 }, { unique: true });

const UserListModel = mongoose.model<UserList & Document>('UserList', UserListSchema);

export default UserListModel;