import mongoose from 'mongoose';



// মডেলটি ইতিমধ্যে তৈরি থাকলে পুনরায় তৈরি না করা
export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);