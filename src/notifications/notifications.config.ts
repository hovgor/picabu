import admin from 'firebase-admin';
// import messageGenerator from '../utils/constatnts/notification.messages.js';
import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationMainService {
  private adminApp: any;

  private async initializeApp(): Promise<void> {
    const filePath = path.join(__dirname, 'serviceAccountKey.json');
    const gag: any = fs.readFileSync(filePath);
    this.adminApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(gag)),
    });
  }

  async sendGlobalNotification(
    to: any,
    title: string,
    body: string,
  ): Promise<void> {
    if (!this.adminApp) {
      await this.initializeApp();
    }

    const payload: any = {
      notification: {
        title,
        body,
        sound: 'default',
      },
    };
    const options: any = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };
    await this.sendNotification(to, payload, options);
  }

  async sendDataNotification(to: any, data: any): Promise<void> {
    if (!this.adminApp) {
      await this.initializeApp();
    }

    for (const [key, value] of Object.entries(data)) {
      if (!value && value !== 0) {
        delete data[key];
      } else {
        data[key] =
          key !== 'relatedToIdObj' ? value.toString() : JSON.stringify(value);
      }
    }

    const options: any = {
      priority: 'high',
      content_available: true,
    };

    for (const device of to) {
      const payload: any = {
        data,
      };

      if (device.platform == 'ios') {
        payload.notification = {
          title: 'Challlenge.me',
          body: await this.messageGenerator(data),
          sound: 'default',
        };
        this.sendNotification(device.token, payload, options);
      } else if (device.platform == 'android') {
        this.sendNotification(device.token, payload, options);
      }
    }
  }

  private async sendNotification(
    token: any,
    payload: any,
    options: any,
  ): Promise<void> {
    if (!this.adminApp) {
      await this.initializeApp();
    }

    this.adminApp
      .messaging()
      .sendToDevice(token, payload, options)
      .then((response) => {
        Logger.log('Notification sent successfully');
      })
      .catch((error) => {
        Logger.error(error);
      });
  }

  private async messageGenerator(data) {
    const type = +data.notificationType;
    const nickname = data.nickname || 'Someone';
    const title = data.title || '👽';
    const { postName, communityName } = data;
    let text = '';

    switch (type) {
      case 0:
        text = `Woooow 😮 ${nickname} started following you 😍`; // User started following you
        break;
      case 1:
        text = `Hmmm 🤔 ${nickname} sent you a follow request 🙃`; // User requested to follow you
        break;
      case 2:
        text = `Check it ! ${nickname} requested to follow to ${
          communityName || 'community'
        } 😮`; // User requested to follow you
        break;
      case 3:
        text = `Greatt ! ${nickname} started following to ${
          communityName || 'community'
        } 😮`; // User started following you
        break;
      case 4:
        text = `Ohhhh ! ${nickname} reacted to your ${postName || 'post'} !`; // User reacted Your post
        break;
      case 5:
        text = `Hey Heeey ! ${nickname} commented to your ${
          postName || 'post'
        } !`; // User Commented your post
        break;
      case 6:
        text = `Reply is here ! ${nickname} replied to your ${
          postName || 'post'
        } comment !`; // User replied your comment
        break;
      case 7:
        text = `Bad news ! ${nickname} Downvoted your ${postName || 'post'} !`; // User Downvoted your post
        break;
      case 8:
        text = `Great news ! ${nickname} Upvoted your ${postName || 'post'} !`; // User Upvoted your post
        break;
    }
    return text;
  }
}
