import mongoose, { Model, Schema } from 'mongoose';
import { BlogPostInputDto } from '../types/postsInputDto';
import { PostDocument, PostModelStatics } from '../types/postsViewModel';
import { LikeStatusValue } from '../../comments/models';
import { PostLikeModel } from '../../likes/entity/postLikes';

const POSTS_COLLECTION_NAME = 'posts';

export const postSchema = new Schema<PostDocument>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  likesCount: { type: Number, required: true },
  dislikesCount: { type: Number, required: true },
});

postSchema.methods.setLikeStatus = async function (
  userId: string,
  login: string,
  status: LikeStatusValue,
) {
  const post = this;
  const postId = post._id.toString();
  const like = await PostLikeModel.findOne({ userId, postId });

  if (like && like.status === status) return;

  if (status === LikeStatusValue.None) {
    if (like) {
      if (like.status === LikeStatusValue.Like) {
        post.likesCount--;
      } else {
        post.dislikesCount--;
      }
      await PostLikeModel.deleteOne({ userId, postId });
    }
    await post.save();
    return;
  }

  if (!like) {
    await PostLikeModel.createPostLike(userId, login, postId, status);
    if (status === LikeStatusValue.Like) {
      post.likesCount++;
    } else {
      post.dislikesCount++;
    }
    await post.save();
    return;
  }

  if (
    like.status === LikeStatusValue.Like &&
    status === LikeStatusValue.Dislike
  ) {
    post.likesCount--;
    post.dislikesCount++;
  } else if (
    like.status === LikeStatusValue.Dislike &&
    status === LikeStatusValue.Like
  ) {
    post.likesCount++;
    post.dislikesCount--;
  }
  like.status = status;
  await like.save();
  await post.save();
  return;
};

postSchema.statics.createPost = function (
  dto: BlogPostInputDto,
  blogId: string,
  blogName: string,
) {
  return new PostModel({
    title: dto.title,
    content: dto.content,
    shortDescription: dto.shortDescription,
    createdAt: new Date().toISOString(),
    blogId,
    blogName,
    likesCount: 0,
    dislikesCount: 0,
  });
};

export const PostModel = mongoose.model<
  PostDocument,
  Model<PostDocument> & PostModelStatics
>(POSTS_COLLECTION_NAME, postSchema);
