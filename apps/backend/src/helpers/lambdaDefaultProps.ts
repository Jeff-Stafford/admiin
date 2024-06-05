import { Duration } from 'aws-cdk-lib';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import * as path from 'path';
import { externalLibs } from './code';

// https://github.com/ranguard/cdk-talk-examples/blob/master/code/lambda_layer_example/lib/layer_use-stack.ts
export const getLambdaDefaultProps = (scope: Construct, funcName: string) => {
  const dependencyLayerArn = StringParameter.valueFromLookup(
    scope,
    'dependencyLambdaLayer'
  );
  const dependencyLayerFromArn = LayerVersion.fromLayerVersionArn(
    scope,
    `DependencyLayerFromArn${funcName}`,
    dependencyLayerArn
  );

  return {
    runtime: Runtime.NODEJS_18_X,
    layers: [dependencyLayerFromArn],
    logRetention: RetentionDays.ONE_YEAR,
    timeout: Duration.seconds(30),
    entry: path.join(__dirname, `../functions/${funcName}/index.ts`),
    handler: 'handler',
    bundling: {
      externalModules: externalLibs, //Added external libraries because error was showing for pnp
    },
  };
};
