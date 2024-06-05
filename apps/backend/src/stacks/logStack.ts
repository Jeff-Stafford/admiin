import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketPolicy } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { appName, env, isProd } from '../helpers/constants';
export class LogStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const logBucket = new Bucket(this, 'LogBucket', {
      bucketName: `${appName.toLowerCase()}-logs-${env}`,
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    const logBucketPolicy = new BucketPolicy(this, 'LogBucketPolicy', {
      bucket: logBucket,
    });

    console.log('logBucket.bucketArn: ', logBucket.bucketArn);

    logBucketPolicy.document.addStatements(
      new PolicyStatement({
        actions: ['s3:PutObject'],
        principals: [new ServicePrincipal('logs.amazonaws.com')],
        resources: [`${logBucket.bucketArn}/*`],
        conditions: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
          },
        },
      }),
      new PolicyStatement({
        actions: ['s3:GetBucketAcl'],
        principals: [new ServicePrincipal('logs.amazonaws.com')],
        resources: [logBucket.bucketArn],
      })
    );

    //logBucketPolicy.document.addStatements(
    //  new PolicyStatement({
    //    actions: [
    //      's3:PutObject',
    //      's3:GetBucketAcl',
    //    ],
    //    effect: Effect.ALLOW,
    //    principals: [new ServicePrincipal('logs.us-east-1.amazonaws.com')],
    //    resources: [`${logBucket.bucketArn}/*`],
    //    conditions: {
    //      StringEquals: {
    //        's3:x-amz-acl': 'bucket-owner-full-control',
    //      },
    //    },
    //  })
    //);
  }
}
