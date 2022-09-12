import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PostValidator } from 'src/shared/validators/post.validator';
import { Repository } from 'typeorm';
import { PostsEntityBase } from '../entity/posts.entity';
import { ReactionIconsEntityBase } from './entity/reaction.icons.entity';

@Injectable()
export class ReactionIconsService {
  constructor(
    @InjectRepository(ReactionIconsEntityBase)
    private reactionIconsRepository: Repository<ReactionIconsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly postValidator: PostValidator,
    @InjectRepository(PostsEntityBase)
    private readonly postsRepository: Repository<PostsEntityBase>,
  ) {}

  async addReactionIconsForPosts(
    postId: number,
    request: any,
    reactionType: any,
  ) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorization!!!');
      }

      const validPost = await this.postsRepository.findOne({
        where: { id: postId },
      });

      if (!validPost) {
        throw new NotFoundException('Post is not defined!!!');
      }

      const validReactionType = this.postValidator.reactionIcons(reactionType);

      const reaction = await this.reactionIconsRepository.findOne({
        where: {
          postId: postId,
          userId: user.id,
        },
      });

      if (reaction) {
        await this.reactionIconsRepository.update(
          { id: reaction.id },
          { reactionType: validReactionType },
        );
        return {
          data: reaction,
          error: false,
          message: 'update reaction icons type!!!',
        };
      }
      const newReaction = await this.reactionIconsRepository.save(
        this.reactionIconsRepository.create({
          userId: user.id,
          reactionType: validReactionType,
          postId: postId,
        }),
      );
      return {
        data: newReaction,
        error: false,
        message: 'add new reaction icon for post!!!',
      };
    } catch (error) {
      Logger.log('error=> add reaction icons function ', error);
      throw error;
    }
  }
}
