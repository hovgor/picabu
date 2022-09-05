import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PostReactions } from 'src/shared/types/reactions';
import { PostValidator } from 'src/shared/validators/post.validator';
import { Repository } from 'typeorm';
import { ReactionIconsEntityBase } from './entity/reaction.icons.entity';

@Injectable()
export class ReactionIconsService {
  constructor(
    @InjectRepository(ReactionIconsEntityBase)
    private reactionIconsRepository: Repository<ReactionIconsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly postValidator: PostValidator,
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
