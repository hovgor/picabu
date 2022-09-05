import { Logger } from '@nestjs/common';

export class PostValidator {
  public reactionIcons(reactionType: string) {
    try {
      const reactionTypes = ['default', 'Smile', 'Kind', 'Wow', 'Cry', 'Angry'];
      for (let i = 0; i < reactionTypes.length; ++i) {
        if (reactionType === reactionTypes[i]) {
          return i + 1;
        }
      }
    } catch (error) {
      Logger.log(
        'error=> post validator reaction icons validator function ',
        error,
      );
      throw error;
    }
  }
}
