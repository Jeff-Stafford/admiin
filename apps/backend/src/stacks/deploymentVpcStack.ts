import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface VpcStackProps extends NestedStackProps {
  readonly useEfs?: boolean;
}

export class DeploymentVpcStack extends NestedStack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, 'DeploymentVpc', {});
  }
}
