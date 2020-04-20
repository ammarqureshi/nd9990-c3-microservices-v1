import AWS = require('aws-sdk');
import { config } from './config/config';

const c = config.dev;

//Configure AWS
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: {Bucket: c.aws_media_bucket}
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl( key: string ): string{

  const signedUrlExpireSeconds = 60 * 5

  var params = {
    Bucket: c.aws_media_bucket
   };

   console.log('param bucket: ' + params.Bucket)
   s3.getBucketLocation(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log('s3 bucket location: ' + data);           // successful response

   });



  s3.getBucketPolicy(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('s3 bucket policy: ' + data);           // successful response
  
  });

  s3.getBucketCors(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('s3 bucket cors: ' + data);           // successful response
  });

  s3.getBucketLogging(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('s3 bucket log: ' + data);           // successful response
  });



    const url = s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });
    console.log('GET signed url: ' + url);
    return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ){

    const signedUrlExpireSeconds = 60 * 5

    const url = s3.getSignedUrl('putObject', {
      Bucket: c.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    });
    console.log('PUT signed url: ' + url);

    return url;
}