import { CfnOutput, NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { WebDeploymentConstruct } from '../constructs/webDeploymentConstruct';

interface WebDeploymentStackProps extends NestedStackProps {
  readonly appName: string;
  readonly stage: string;
  readonly domain: string;
  readonly zone: IHostedZone;
  readonly type: string;
  readonly buildPath: string;
  readonly memoryLimit?: number;
  readonly useEfs?: boolean;
  readonly vpc?: Vpc;
  readonly backendExports: Record<string, any>;
}

export class WebDeploymentStack extends NestedStack {
  public readonly webDistribution: Distribution;
  constructor(scope: Construct, id: string, props: WebDeploymentStackProps) {
    super(scope, id, props);

    const web = new WebDeploymentConstruct(this, 'WebDeployment', props);
    this.webDistribution = web.distribution;

    new CfnOutput(this, 'DistributionId', {
      value: web.distribution.distributionId,
    });
  }
}
