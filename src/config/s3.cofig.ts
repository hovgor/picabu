import { BadRequestException, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
const {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  UPLOAD_BUCKET,
  URL_EXPIRATION_SECONDS,
  AWS_REGION,
} = process.env;

export default class AWS_S3 {
  aws: any;
  constructor() {
    this.aws = AWS;
  }

  deleteFromS3(key) {
    const s3 = new this.aws.S3({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    const params = { Bucket: UPLOAD_BUCKET, Key: key };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    s3.deleteObject(params, function (err, data) {
      if (err) Logger.error(err, err.stack);
    });
  }

  getSignedUrl(query) {
    // eslint-disable-next-line prefer-const
    let { fileName, action } = query;
    if (!fileName && !action)
      throw new Error('no filename or action in Request');
    if (!fileName.startsWith('/'))
      throw new BadRequestException('Wrong Filename !');
    fileName = 'tutu' + fileName;
    let url = {};
    AWS.config.update({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });

    const s3 = new AWS.S3({
      signatureVersion: 'v4',
    });

    const myBucket = UPLOAD_BUCKET;
    const signedUrlExpireSeconds = +URL_EXPIRATION_SECONDS;

    if (action !== 'PUT' && action !== 'DELETE')
      throw new Error('Wrong Action Type Provided');

    if (action === 'PUT') {
      url = s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: fileName,
        Expires: signedUrlExpireSeconds,
      });
    }

    if (action === 'DELETE') {
      url = s3.getSignedUrl('deleteObject', {
        Bucket: myBucket,
        Key: fileName,
        Expires: signedUrlExpireSeconds,
      });
    }

    return {
      data: { uploadUrl: url, key: fileName },
      error: false,
      message: `Url is Signed to ${action}`,
    };
  }
}
