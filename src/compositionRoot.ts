import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthService } from './auth/service/authService';
import { TokensQueryRepository } from './auth/repositories/tokensQuery.repository';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersService } from './users/services/usersService';
import { UsersController } from './users/router/userController';
import { AuthController } from './auth/router/authController';
import { CommentsController } from './comments/router/commentsController';
import { CommentsRepository } from './comments/repositories/comments.repositiry';
import { CommentsService } from './comments/services/comments.service';
import { CommentsQueryRepository } from './comments/repositories/comments.queryRepositiry';
import { PostsQueryRepository } from './posts/repositories/postsQuery.repository';
import { PostsService } from './posts/services/posts.service';
import { Comment_likesRepository } from './likes/repositories/comment_likes.repository';
import { PostsRepository } from './posts/repositories/posts.repository';
import { BlogsService } from './blogs/aplication/blogs.service';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query.repository';
import { Post_likesRepository } from './likes/repositories/post_likes.repository';
import { PostsController } from './posts/router/postsController';
import { BlogsController } from './blogs/router/blogs.controller';
import { NodemailerService } from './auth/service/nodemailerService';
import { TokensRepository } from './auth/repositories/tokens.repository';

export const container = new Container({});

container.bind(TokensQueryRepository).toSelf();
container.bind(NodemailerService).toSelf().inSingletonScope();

container.bind(UsersService).toSelf();
container.bind<UsersController>(UsersController).toSelf();
container.bind(UsersRepository).toSelf();

container.bind(TokensRepository).toSelf();

container.bind<AuthService>(AuthService).toSelf();
container.bind<AuthController>(AuthController).toSelf();

container.bind<CommentsController>(CommentsController).toSelf();
container.bind<CommentsService>(CommentsService).toSelf();
container.bind<CommentsRepository>(CommentsRepository).toSelf();
container.bind<CommentsQueryRepository>(CommentsQueryRepository).toSelf();

container.bind<Comment_likesRepository>(Comment_likesRepository).toSelf();
container.bind<Post_likesRepository>(Post_likesRepository).toSelf();

container.bind<PostsController>(PostsController).toSelf();
container.bind<PostsService>(PostsService).toSelf();
container.bind<PostsQueryRepository>(PostsQueryRepository).toSelf();
container.bind<PostsRepository>(PostsRepository).toSelf();

container.bind<BlogsController>(BlogsController).toSelf();
container.bind<BlogsService>(BlogsService).toSelf();
container.bind<BlogsRepository>(BlogsRepository).toSelf();
container.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf();
