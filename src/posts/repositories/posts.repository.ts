import { ObjectId } from 'mongodb';
import { PostModel } from '../entity/posts.Model';
import { injectable } from 'inversify';
import { PostDocument } from '../types/postsViewModel';

@injectable()
export class PostsRepository {
  async getPost(postId: string): Promise<PostDocument | null> {
    return PostModel.findOne({ _id: postId });
  }

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount === 1;
  }

  // async updatePost(id: string, dto: PostInputDto): Promise<boolean> {
  //   const updatedResult = await PostModel.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: {
  //         title: dto.title,
  //         shortDescription: dto.shortDescription,
  //         content: dto.content,
  //         blogId: dto.blogId,
  //       },
  //     },
  //   );
  //
  //   return updatedResult.matchedCount === 1;
  // }
  //
  // async updateCounts(
  //   postId: string,
  //   likesCount: number,
  //   dislikesCount: number,
  // ): Promise<boolean> {
  //   const result = await PostModel.updateOne(
  //     { _id: new ObjectId(postId) },
  //     { $set: { likesCount, dislikesCount } },
  //   ).exec();
  //   return result.matchedCount === 1;
  // }
}
