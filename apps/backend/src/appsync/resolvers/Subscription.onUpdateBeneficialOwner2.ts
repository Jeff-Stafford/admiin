import { util, Context, extensions } from '@aws-appsync/utils';

//https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-enhanced-filtering.html

export function request() {
  //runtime.earlyReturn();
  return { payload: null };
}

export function response(ctx: Context) {
  const { beneficialOwnerId } = ctx.args;
  const filter = { id: { eq: beneficialOwnerId } };
  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));
  return null;
}
