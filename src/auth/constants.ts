export const jwtConstants = {
  access_secret: process.env.JWT_CLIENT_SECRET,
  admin_access_secret: process.env.JWT_ADMIN_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
};

export const awsConstants = {
  aws_region: process.env.AWS_REGION,
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_bucket: process.env.AWS_BUCKET,
  aws_cloudfront_domainname: process.env.AWS_CLOUDFRONT_DOMAINNAME,
};
