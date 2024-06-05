import { Stack, StackProps } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { appName, appPrefix, domain, env, isProd } from '../helpers/constants';
import { WebDeploymentStack } from './webDeploymentStack';

const webDomainName = isProd ? `app.${domain}` : `app-${env}.${domain}`;

interface FrontendStackProps extends StackProps {
  readonly zone: IHostedZone;
}

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // vpc due to limited storage on lambda for deployment bucket
    //const deploymentVpcStack = new DeploymentVpcStack(
    //  this,
    //  'DeploymentVpcStack',
    //  {}
    //);

    // get params from ssm for frontend application
    const identityPoolId = StringParameter.valueFromLookup(
      this,
      'identityPoolId'
    );
    const userPoolId = StringParameter.valueFromLookup(this, 'userPoolId');
    const userPoolClientId = StringParameter.valueFromLookup(
      this,
      'userPoolClientId'
    );
    const graphQLAPIURL = StringParameter.valueFromLookup(
      this,
      'graphQLAPIURL'
    );
    const graphQLAPIKey = StringParameter.valueFromLookup(
      this,
      'graphQLAPIKey'
    );
    const region = StringParameter.valueFromLookup(this, 'backendRegion');
    const restApiName = StringParameter.valueFromLookup(this, 'restApiName');
    const restApiGatewayEndpoint = StringParameter.valueFromLookup(
      this,
      'restApiGatewayEndpoint'
    );
    const mediaBucketName = StringParameter.valueFromLookup(
      this,
      'mediaBucketName'
    );
    const placeIndexName = StringParameter.valueFromLookup(
      this,
      'placeIndexName'
    );

    const backendExports = {
      identityPoolId: identityPoolId,
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      graphQLAPIURL: graphQLAPIURL,
      graphQLAPIKey: graphQLAPIKey,
      mediaBucketName: mediaBucketName,
      region: region,
      restApiName: restApiName,
      restApiGatewayEndpoint: restApiGatewayEndpoint,
      placeIndexName: placeIndexName,
    };

    console.log('backendExports: ', backendExports);

    // react app
    new WebDeploymentStack(this, `${appPrefix}WebDeploymentStack`, {
      appName,
      stage: env,
      domain: webDomainName,
      zone: props.zone,
      type: 'web',
      buildPath: '../../../../dist/apps/react-app',
      backendExports,
      memoryLimit: 512, //e-signature deployment causing issues, likely due to file size in public directory for react-app
      //useEfs: true,
      //vpc: deploymentVpcStack.vpc,
    });

    // backoffice app
    //new WebDeploymentStack(app, `${appPrefix}BackofficeDeploymentStack`, {
    //  env: {
    //    ...defaultEnv,
    //  },
    //  appName,
    //  stage,
    //  domain: backofficeDomainName,
    //  zone: route53Stack.zone,
    //  type: 'backoffice',
    //  buildPath: '../../../../dist/apps/backoffice-app',
    //});
  }
}
