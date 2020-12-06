const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: 'preview/'
  };
  const previews = await s3.listObjectsV2(params).promise();
  const deleteParams = {
    Bucket: process.env.S3_BUCKET,
    Delete: {
      Objects: previews.Contents.map((v) => {
          return {Key: v.Key};
        }).filter((v) => {
          return v.Key !== 'preview/';
        }),
      Quiet: true
    }
  };
  if (deleteParams.Delete.Objects.length > 0) {
    await s3.deleteObjects(deleteParams).promise(); 
  }

  const response = {
    statusCode: 200,
  };
  return response;
};
