/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAdminInput = {
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  locale?: string | null;
  role?: AdminRole | null;
};

export enum AdminRole {
  SuperAdmins = 'SuperAdmins',
  Admins = 'Admins',
}

export type Admin = {
  __typename: 'Admin';
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: AdminRole | null;
  hasAccessed?: boolean | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  owner?: string | null;
};

export type CreateTeamInput = {
  title: string;
};

export type Team = {
  __typename: 'Team';
  title: string;
  teamUsers?: ModelTeamUserConnection | null;
  ownerUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  owner?: string | null;
};

export type ModelTeamUserConnection = {
  __typename: 'ModelTeamUserConnection';
  items: Array<TeamUser | null>;
  nextToken?: string | null;
};

export type TeamUser = {
  __typename: 'TeamUser';
  teamId: string;
  team?: Team | null;
  userId: string;
  user?: User | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owners?: Array<string | null> | null;
  id: string;
  teamTeamUsersId?: string | null;
};

export type User = {
  __typename: 'User';
  id: string;
  identityId?: string | null;
  email?: string | null;
  about?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  blocked?: Array<string | null> | null;
  blockedBy?: Array<string | null> | null;
  country?: string | null;
  profileImg?: Image | null;
  interests?: Array<string | null> | null;
  locale?: string | null;
  billingId?: string | null;
  billing?: Billing | null;
  onboardingStatus?: OnboardingStatus | null;
  teamId?: string | null;
  team?: Team | null;
  userType?: UserType | null;
  reportReasons?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
};

export type Image = {
  __typename: 'Image';
  alt?: string | null;
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type?: string | null;
};

export enum S3UploadLevel {
  public = 'public',
  protected = 'protected',
  private = 'private',
}

export type Billing = {
  __typename: 'Billing';
  customerId: string;
  userId: string;
  planId?: string | null;
  productId?: string | null;
  autoRenewProductId?: string | null;
  subscriptionId?: string | null;
  status?: SubscriptionStatus | null;
  teamId?: string | null;
  trialUsed?: boolean | null;
  paymentProvider?: PaymentProvider | null;
  purchaseToken?: string | null;
  plan?: PlanType | null;
  expiresAt?: string | null;
  cancelledAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  owner?: string | null;
};

export enum SubscriptionStatus {
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  UN_PAID = 'UN_PAID',
  GRACE_PERIOD = 'GRACE_PERIOD',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  APP_STORE = 'APP_STORE',
  GOOGLE_PLAY = 'GOOGLE_PLAY',
}

export enum PlanType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
}

export enum OnboardingStatus {
  PROFILE = 'PROFILE',
  INTERESTS = 'INTERESTS',
  PLANS = 'PLANS',
  COMPLETED = 'COMPLETED',
}

export enum UserType {
  Buyers = 'Buyers',
  Sellers = 'Sellers',
}

export type CreateTeamUserInput = {
  teamId: string;
  firstName: string;
  lastName: string;
  email: string;
  teamTeamUsersId?: string | null;
};

export type CreateTranslationInput = {
  language?: string | null;
  namespace?: string | null;
  name?: string | null;
  value?: string | null;
};

export type Translation = {
  __typename: 'Translation';
  language: string;
  namespace: string;
  data?: string | null;
};

export type UpdateTranslationInput = {
  language?: string | null;
  namespace?: string | null;
  data?: string | null;
};

export type UpdateUserInput = {
  id: string;
  about?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  profileImg?: ImageInput | null;
  interests?: Array<string | null> | null;
  locale?: string | null;
  onboardingStatus?: OnboardingStatus | null;
  userType?: UserType | null;
};

export type ImageInput = {
  alt?: string | null;
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type?: string | null;
};

export type DeleteAdminInput = {
  userId: string;
};

export type DeleteTeamUserInput = {
  id?: string | null;
};

export type StripePaymentCheckoutInput = {
  priceId: string;
  returnUrl: string;
  successUrl: string;
  currency: string;
  locale?: string | null;
};

export type StripePaymentCheckout = {
  __typename: 'StripePaymentCheckout';
  url?: string | null;
};

export type StripeCustomerPortalInput = {
  returnUrl: string;
  locale?: string | null;
};

export type StripeCustomerPortal = {
  __typename: 'StripeCustomerPortal';
  url?: string | null;
};

export type StripeUpdateSubscription = {
  priceId?: string | null;
};

export type BlockUserInput = {
  userId?: string | null;
  reason?: ReportReason | null;
};

export enum ReportReason {
  SPAM = 'SPAM',
  OFFENSIVE = 'OFFENSIVE',
}

export type Message = {
  __typename: 'Message';
  conversationId: string;
  text?: string | null;
  attachments?: Array<S3Upload | null> | null;
  users: Array<string | null>;
  receiver: string;
  sender: string;
  createdBy: string;
  readBy?: Array<string | null> | null;
  createdAt: string;
  updatedAt?: string | null;
  id: string;
  conversationMessagesId?: string | null;
};

export type S3Upload = {
  __typename: 'S3Upload';
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type: S3UploadType;
};

export enum S3UploadType {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

export type VerifyIAPInput = {
  receipt: string;
  service: PaymentProvider;
  subscriptionId?: string | null;
};

export type UpdateAdminInput = {
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: AdminRole | null;
  hasAccessed?: boolean | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type ModelAdminConditionInput = {
  country?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  email?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  role?: ModelAdminRoleInput | null;
  hasAccessed?: ModelBooleanInput | null;
  createdBy?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelAdminConditionInput | null> | null;
  or?: Array<ModelAdminConditionInput | null> | null;
  not?: ModelAdminConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
  _null = '_null',
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelAdminRoleInput = {
  eq?: AdminRole | null;
  ne?: AdminRole | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type CreateConversationInput = {
  title?: string | null;
  image?: ImageInput | null;
  country?: string | null;
  productId: string;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
};

export type ModelConversationConditionInput = {
  title?: ModelStringInput | null;
  country?: ModelStringInput | null;
  productId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelConversationConditionInput | null> | null;
  or?: Array<ModelConversationConditionInput | null> | null;
  not?: ModelConversationConditionInput | null;
};

export type Conversation = {
  __typename: 'Conversation';
  title?: string | null;
  image?: Image | null;
  country?: string | null;
  messages?: ModelMessageConnection | null;
  userConversations?: ModelUserConversationConnection | null;
  productId: string;
  product?: Product | null;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type ModelMessageConnection = {
  __typename: 'ModelMessageConnection';
  items: Array<Message | null>;
  nextToken?: string | null;
};

export type ModelUserConversationConnection = {
  __typename: 'ModelUserConversationConnection';
  items: Array<UserConversation | null>;
  nextToken?: string | null;
};

export type UserConversation = {
  __typename: 'UserConversation';
  conversationId: string;
  conversation?: Conversation | null;
  userId: string;
  user?: User | null;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationUserConversationsId?: string | null;
};

export type Product = {
  __typename: 'Product';
  title: string;
  category: string;
  description: string;
  images: Array<Image>;
  tags: Array<string>;
  country?: string | null;
  status: ProductStatus;
  owner?: string | null;
  teamId?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export enum ProductStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type UpdateConversationInput = {
  title?: string | null;
  image?: ImageInput | null;
  country?: string | null;
  productId?: string | null;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type DeleteConversationInput = {
  id: string;
};

export type CreateUserConversationInput = {
  conversationId: string;
  userId: string;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
  conversationUserConversationsId?: string | null;
};

export type ModelUserConversationConditionInput = {
  conversationId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserConversationConditionInput | null> | null;
  or?: Array<ModelUserConversationConditionInput | null> | null;
  not?: ModelUserConversationConditionInput | null;
  conversationUserConversationsId?: ModelIDInput | null;
};

export type UpdateUserConversationInput = {
  conversationId?: string | null;
  userId?: string | null;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationUserConversationsId?: string | null;
};

export type DeleteUserConversationInput = {
  id: string;
};

export type CreateMessageInput = {
  conversationId: string;
  text?: string | null;
  attachments?: Array<S3UploadInput | null> | null;
  users: Array<string | null>;
  receiver: string;
  sender: string;
  createdBy: string;
  readBy?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
  conversationMessagesId?: string | null;
};

export type S3UploadInput = {
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type: S3UploadType;
};

export type ModelMessageConditionInput = {
  conversationId?: ModelIDInput | null;
  text?: ModelStringInput | null;
  users?: ModelStringInput | null;
  receiver?: ModelIDInput | null;
  sender?: ModelIDInput | null;
  createdBy?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelMessageConditionInput | null> | null;
  or?: Array<ModelMessageConditionInput | null> | null;
  not?: ModelMessageConditionInput | null;
  conversationMessagesId?: ModelIDInput | null;
};

export type UpdateMessageInput = {
  conversationId?: string | null;
  text?: string | null;
  attachments?: Array<S3UploadInput | null> | null;
  users?: Array<string | null> | null;
  receiver?: string | null;
  sender?: string | null;
  createdBy?: string | null;
  readBy?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationMessagesId?: string | null;
};

export type CreateOptionInput = {
  name?: string | null;
  label: string;
  value: string;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
};

export type ModelOptionConditionInput = {
  name?: ModelStringInput | null;
  label?: ModelStringInput | null;
  value?: ModelStringInput | null;
  group?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelOptionConditionInput | null> | null;
  or?: Array<ModelOptionConditionInput | null> | null;
  not?: ModelOptionConditionInput | null;
};

export type Option = {
  __typename: 'Option';
  name?: string | null;
  label: string;
  value: string;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type UpdateOptionInput = {
  name?: string | null;
  label?: string | null;
  value?: string | null;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type DeleteOptionInput = {
  id: string;
};

export type CreateProductInput = {
  title: string;
  category: string;
  description: string;
  images: Array<ImageInput>;
  tags: Array<string>;
  country?: string | null;
  status: ProductStatus;
  owner?: string | null;
  teamId?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
};

export type ModelProductConditionInput = {
  title?: ModelStringInput | null;
  category?: ModelStringInput | null;
  description?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  country?: ModelStringInput | null;
  status?: ModelProductStatusInput | null;
  owner?: ModelIDInput | null;
  teamId?: ModelStringInput | null;
  expiresAt?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelProductConditionInput | null> | null;
  or?: Array<ModelProductConditionInput | null> | null;
  not?: ModelProductConditionInput | null;
};

export type ModelProductStatusInput = {
  eq?: ProductStatus | null;
  ne?: ProductStatus | null;
};

export type UpdateProductInput = {
  title?: string | null;
  category?: string | null;
  description?: string | null;
  images?: Array<ImageInput> | null;
  tags?: Array<string> | null;
  country?: string | null;
  status?: ProductStatus | null;
  owner?: string | null;
  teamId?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type DeleteProductInput = {
  id: string;
};

export type UpdateTeamInput = {
  title?: string | null;
  ownerUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type ModelTeamConditionInput = {
  title?: ModelStringInput | null;
  ownerUserId?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTeamConditionInput | null> | null;
  or?: Array<ModelTeamConditionInput | null> | null;
  not?: ModelTeamConditionInput | null;
};

export type ModelTeamUserConditionInput = {
  teamId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owners?: ModelStringInput | null;
  and?: Array<ModelTeamUserConditionInput | null> | null;
  or?: Array<ModelTeamUserConditionInput | null> | null;
  not?: ModelTeamUserConditionInput | null;
  teamTeamUsersId?: ModelIDInput | null;
};

export type StripeSession = {
  __typename: 'StripeSession';
  id?: string | null;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  line_items?: StripeLineItems | null;
  locale?: string | null;
  metadata?: string | null;
  payment_status?: StripeSessionPaymentStatus | null;
  subscription?: StripeSubscription | null;
};

export type StripeLineItems = {
  __typename: 'StripeLineItems';
  data?: Array<StripeLineItem | null> | null;
};

export type StripeLineItem = {
  __typename: 'StripeLineItem';
  id?: string | null;
  amount_discount?: number | null;
  amount_subtotal: number;
  amount_tax?: number | null;
  amount_total: number;
  currency: string;
  description?: string | null;
  price?: StripePrice | null;
};

export type StripePrice = {
  __typename: 'StripePrice';
  id: string;
  active: boolean;
  billing_scheme?: string | null;
  currency: string;
  metadata?: StripePriceMeta | null;
  nickname?: string | null;
  product: string;
  recurring?: StripePriceRecurring | null;
  tax_behavior?: string | null;
  type?: string | null;
  unit_amount: number;
  unit_amount_decimal: number;
  currency_options?: string | null;
};

export type StripePriceMeta = {
  __typename: 'StripePriceMeta';
  monthlyAccessQuantity?: string | null;
  userSeats?: string | null;
};

export type StripePriceRecurring = {
  __typename: 'StripePriceRecurring';
  interval: StripePriceInterval;
  interval_count: number;
  usage_type: StripeUsageType;
};

export enum StripePriceInterval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export enum StripeUsageType {
  metered = 'metered',
  licensed = 'licensed',
}

export enum StripeSessionPaymentStatus {
  paid = 'paid',
  unpaid = 'unpaid',
  no_payment_required = 'no_payment_required',
}

export type StripeSubscription = {
  __typename: 'StripeSubscription';
  id: string;
  cancel_at?: string | null;
  currency?: string | null;
  current_period_end?: number | null;
  current_period_start?: number | null;
  customer?: string | null;
  description?: string | null;
  ended_at?: number | null;
  metadata?: string | null;
  start_date?: number | null;
  status?: SubscriptionStatus | null;
  trial_end?: number | null;
  trial_start?: number | null;
};

export type StripeProduct = {
  __typename: 'StripeProduct';
  id?: string | null;
  active?: boolean | null;
  default_price?: string | null;
  description?: string | null;
  livemode?: boolean | null;
  metadata: StripeProductMeta;
  name?: string | null;
};

export type StripeProductMeta = {
  __typename: 'StripeProductMeta';
  order: string;
  userType: UserType;
  subscription: string;
};

export type TranslationConnection = {
  __typename: 'TranslationConnection';
  language?: string | null;
  items?: Array<Translation | null> | null;
};

export type ModelAdminFilterInput = {
  country?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  email?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  role?: ModelAdminRoleInput | null;
  hasAccessed?: ModelBooleanInput | null;
  createdBy?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelAdminFilterInput | null> | null;
  or?: Array<ModelAdminFilterInput | null> | null;
  not?: ModelAdminFilterInput | null;
};

export type ModelAdminConnection = {
  __typename: 'ModelAdminConnection';
  items: Array<Admin | null>;
  nextToken?: string | null;
};

export type ModelBillingFilterInput = {
  customerId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  planId?: ModelIDInput | null;
  productId?: ModelIDInput | null;
  autoRenewProductId?: ModelIDInput | null;
  subscriptionId?: ModelIDInput | null;
  status?: ModelSubscriptionStatusInput | null;
  teamId?: ModelIDInput | null;
  trialUsed?: ModelBooleanInput | null;
  paymentProvider?: ModelPaymentProviderInput | null;
  purchaseToken?: ModelIDInput | null;
  plan?: ModelPlanTypeInput | null;
  expiresAt?: ModelStringInput | null;
  cancelledAt?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelBillingFilterInput | null> | null;
  or?: Array<ModelBillingFilterInput | null> | null;
  not?: ModelBillingFilterInput | null;
};

export type ModelSubscriptionStatusInput = {
  eq?: SubscriptionStatus | null;
  ne?: SubscriptionStatus | null;
};

export type ModelPaymentProviderInput = {
  eq?: PaymentProvider | null;
  ne?: PaymentProvider | null;
};

export type ModelPlanTypeInput = {
  eq?: PlanType | null;
  ne?: PlanType | null;
};

export type ModelBillingConnection = {
  __typename: 'ModelBillingConnection';
  items: Array<Billing | null>;
  nextToken?: string | null;
};

export enum ModelSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type ModelConversationFilterInput = {
  title?: ModelStringInput | null;
  country?: ModelStringInput | null;
  productId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelConversationFilterInput | null> | null;
  or?: Array<ModelConversationFilterInput | null> | null;
  not?: ModelConversationFilterInput | null;
};

export type ModelConversationConnection = {
  __typename: 'ModelConversationConnection';
  items: Array<Conversation | null>;
  nextToken?: string | null;
};

export type ModelUserConversationFilterInput = {
  conversationId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserConversationFilterInput | null> | null;
  or?: Array<ModelUserConversationFilterInput | null> | null;
  not?: ModelUserConversationFilterInput | null;
  conversationUserConversationsId?: ModelIDInput | null;
};

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelMessageFilterInput = {
  conversationId?: ModelIDInput | null;
  text?: ModelStringInput | null;
  users?: ModelStringInput | null;
  receiver?: ModelIDInput | null;
  sender?: ModelIDInput | null;
  createdBy?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelMessageFilterInput | null> | null;
  or?: Array<ModelMessageFilterInput | null> | null;
  not?: ModelMessageFilterInput | null;
  conversationMessagesId?: ModelIDInput | null;
};

export type ModelOptionFilterInput = {
  name?: ModelStringInput | null;
  label?: ModelStringInput | null;
  value?: ModelStringInput | null;
  group?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelOptionFilterInput | null> | null;
  or?: Array<ModelOptionFilterInput | null> | null;
  not?: ModelOptionFilterInput | null;
};

export type ModelOptionConnection = {
  __typename: 'ModelOptionConnection';
  items: Array<Option | null>;
  nextToken?: string | null;
};

export type ModelProductFilterInput = {
  title?: ModelStringInput | null;
  category?: ModelStringInput | null;
  description?: ModelStringInput | null;
  tags?: ModelStringInput | null;
  country?: ModelStringInput | null;
  status?: ModelProductStatusInput | null;
  owner?: ModelIDInput | null;
  teamId?: ModelStringInput | null;
  expiresAt?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelProductFilterInput | null> | null;
  or?: Array<ModelProductFilterInput | null> | null;
  not?: ModelProductFilterInput | null;
};

export type ModelProductConnection = {
  __typename: 'ModelProductConnection';
  items: Array<Product | null>;
  nextToken?: string | null;
};

export type ModelTeamFilterInput = {
  title?: ModelStringInput | null;
  ownerUserId?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTeamFilterInput | null> | null;
  or?: Array<ModelTeamFilterInput | null> | null;
  not?: ModelTeamFilterInput | null;
};

export type ModelTeamConnection = {
  __typename: 'ModelTeamConnection';
  items: Array<Team | null>;
  nextToken?: string | null;
};

export type ModelTeamUserFilterInput = {
  teamId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  owners?: ModelStringInput | null;
  and?: Array<ModelTeamUserFilterInput | null> | null;
  or?: Array<ModelTeamUserFilterInput | null> | null;
  not?: ModelTeamUserFilterInput | null;
  teamTeamUsersId?: ModelIDInput | null;
};

export type Transaction = {
  __typename: 'Transaction';
  userId?: string | null;
  billingId?: string | null;
  purchaseToken?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  owner?: string | null;
};

export type ModelTransactionFilterInput = {
  userId?: ModelStringInput | null;
  billingId?: ModelStringInput | null;
  purchaseToken?: ModelStringInput | null;
  expiresAt?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTransactionFilterInput | null> | null;
  or?: Array<ModelTransactionFilterInput | null> | null;
  not?: ModelTransactionFilterInput | null;
};

export type ModelTransactionConnection = {
  __typename: 'ModelTransactionConnection';
  items: Array<Transaction | null>;
  nextToken?: string | null;
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null;
  identityId?: ModelIDInput | null;
  email?: ModelStringInput | null;
  about?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  blocked?: ModelStringInput | null;
  blockedBy?: ModelStringInput | null;
  country?: ModelStringInput | null;
  interests?: ModelStringInput | null;
  locale?: ModelStringInput | null;
  billingId?: ModelIDInput | null;
  onboardingStatus?: ModelOnboardingStatusInput | null;
  teamId?: ModelIDInput | null;
  userType?: ModelUserTypeInput | null;
  reportReasons?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserFilterInput | null> | null;
  or?: Array<ModelUserFilterInput | null> | null;
  not?: ModelUserFilterInput | null;
};

export type ModelOnboardingStatusInput = {
  eq?: OnboardingStatus | null;
  ne?: OnboardingStatus | null;
};

export type ModelUserTypeInput = {
  eq?: UserType | null;
  ne?: UserType | null;
};

export type ModelUserConnection = {
  __typename: 'ModelUserConnection';
  items: Array<User | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionConversationFilterInput = {
  title?: ModelSubscriptionStringInput | null;
  country?: ModelSubscriptionStringInput | null;
  productId?: ModelSubscriptionIDInput | null;
  readBy?: ModelSubscriptionStringInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionConversationFilterInput | null> | null;
  or?: Array<ModelSubscriptionConversationFilterInput | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionUserConversationFilterInput = {
  conversationId?: ModelSubscriptionIDInput | null;
  userId?: ModelSubscriptionIDInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionUserConversationFilterInput | null> | null;
  or?: Array<ModelSubscriptionUserConversationFilterInput | null> | null;
};

export type ModelSubscriptionMessageFilterInput = {
  conversationId?: ModelSubscriptionIDInput | null;
  text?: ModelSubscriptionStringInput | null;
  receiver?: ModelSubscriptionIDInput | null;
  sender?: ModelSubscriptionIDInput | null;
  createdBy?: ModelSubscriptionStringInput | null;
  readBy?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionMessageFilterInput | null> | null;
  or?: Array<ModelSubscriptionMessageFilterInput | null> | null;
};

export type ModelSubscriptionProductFilterInput = {
  title?: ModelSubscriptionStringInput | null;
  category?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  tags?: ModelSubscriptionStringInput | null;
  country?: ModelSubscriptionStringInput | null;
  status?: ModelSubscriptionStringInput | null;
  teamId?: ModelSubscriptionStringInput | null;
  expiresAt?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionProductFilterInput | null> | null;
  or?: Array<ModelSubscriptionProductFilterInput | null> | null;
};

export type ModelSubscriptionTeamFilterInput = {
  title?: ModelSubscriptionStringInput | null;
  ownerUserId?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionTeamFilterInput | null> | null;
  or?: Array<ModelSubscriptionTeamFilterInput | null> | null;
};

export type CreateAdminItemMutationVariables = {
  input?: CreateAdminInput | null;
};

export type CreateAdminItemMutation = {
  createAdminItem?: {
    __typename: 'Admin';
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type CreateTeamItemMutationVariables = {
  input?: CreateTeamInput | null;
};

export type CreateTeamItemMutation = {
  createTeamItem?: {
    __typename: 'Team';
    title: string;
    teamUsers?: {
      __typename: 'ModelTeamUserConnection';
      items: Array<{
        __typename: 'TeamUser';
        teamId: string;
        userId: string;
        createdAt?: string | null;
        updatedAt?: string | null;
        owners?: Array<string | null> | null;
        id: string;
        teamTeamUsersId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ownerUserId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type CreateTeamUserItemMutationVariables = {
  input?: CreateTeamUserInput | null;
};

export type CreateTeamUserItemMutation = {
  createTeamUserItem?: {
    __typename: 'TeamUser';
    teamId: string;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owners?: Array<string | null> | null;
    id: string;
    teamTeamUsersId?: string | null;
  } | null;
};

export type CreateTranslationMutationVariables = {
  input?: CreateTranslationInput | null;
};

export type CreateTranslationMutation = {
  createTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type UpdateTranslationMutationVariables = {
  input?: UpdateTranslationInput | null;
};

export type UpdateTranslationMutation = {
  updateTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type UpdateUserItemMutationVariables = {
  input?: UpdateUserInput | null;
};

export type UpdateUserItemMutation = {
  updateUserItem?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    billingId?: string | null;
    billing?: {
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    onboardingStatus?: OnboardingStatus | null;
    teamId?: string | null;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userType?: UserType | null;
    reportReasons?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null;
};

export type DeleteAccountMutation = {
  deleteAccount?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    billingId?: string | null;
    billing?: {
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    onboardingStatus?: OnboardingStatus | null;
    teamId?: string | null;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userType?: UserType | null;
    reportReasons?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null;
};

export type DeleteAdminItemMutationVariables = {
  input?: DeleteAdminInput | null;
};

export type DeleteAdminItemMutation = {
  deleteAdminItem?: {
    __typename: 'Admin';
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type DeleteTeamUserItemMutationVariables = {
  input?: DeleteTeamUserInput | null;
};

export type DeleteTeamUserItemMutation = {
  deleteTeamUserItem?: {
    __typename: 'TeamUser';
    teamId: string;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owners?: Array<string | null> | null;
    id: string;
    teamTeamUsersId?: string | null;
  } | null;
};

export type StripePaymentCheckoutMutationVariables = {
  input?: StripePaymentCheckoutInput | null;
};

export type StripePaymentCheckoutMutation = {
  stripePaymentCheckout?: {
    __typename: 'StripePaymentCheckout';
    url?: string | null;
  } | null;
};

export type StripeCreateCustomerPortalMutationVariables = {
  input?: StripeCustomerPortalInput | null;
};

export type StripeCreateCustomerPortalMutation = {
  stripeCreateCustomerPortal?: {
    __typename: 'StripeCustomerPortal';
    url?: string | null;
  } | null;
};

export type StripeUpdateSubscriptionMutationVariables = {
  input?: StripeUpdateSubscription | null;
};

export type StripeUpdateSubscriptionMutation = {
  stripeUpdateSubscription?: string | null;
};

export type BlockUserMutationVariables = {
  input?: BlockUserInput | null;
};

export type BlockUserMutation = {
  blockUser?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    billingId?: string | null;
    billing?: {
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    onboardingStatus?: OnboardingStatus | null;
    teamId?: string | null;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userType?: UserType | null;
    reportReasons?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null;
};

export type PublishUserMessageMutationVariables = {
  userId: string;
};

export type PublishUserMessageMutation = {
  publishUserMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type ValidateUserIAPReceiptMutationVariables = {
  input?: VerifyIAPInput | null;
};

export type ValidateUserIAPReceiptMutation = {
  validateUserIAPReceipt?: {
    __typename: 'Billing';
    customerId: string;
    userId: string;
    planId?: string | null;
    productId?: string | null;
    autoRenewProductId?: string | null;
    subscriptionId?: string | null;
    status?: SubscriptionStatus | null;
    teamId?: string | null;
    trialUsed?: boolean | null;
    paymentProvider?: PaymentProvider | null;
    purchaseToken?: string | null;
    plan?: PlanType | null;
    expiresAt?: string | null;
    cancelledAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type UpdateAdminMutationVariables = {
  input: UpdateAdminInput;
  condition?: ModelAdminConditionInput | null;
};

export type UpdateAdminMutation = {
  updateAdmin?: {
    __typename: 'Admin';
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type CreateConversationMutation = {
  createConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateConversationMutationVariables = {
  input: UpdateConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type UpdateConversationMutation = {
  updateConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type DeleteConversationMutationVariables = {
  input: DeleteConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type DeleteConversationMutation = {
  deleteConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type CreateUserConversationMutationVariables = {
  input: CreateUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type CreateUserConversationMutation = {
  createUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type UpdateUserConversationMutationVariables = {
  input: UpdateUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type UpdateUserConversationMutation = {
  updateUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type DeleteUserConversationMutationVariables = {
  input: DeleteUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type DeleteUserConversationMutation = {
  deleteUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput;
  condition?: ModelMessageConditionInput | null;
};

export type CreateMessageMutation = {
  createMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput;
  condition?: ModelMessageConditionInput | null;
};

export type UpdateMessageMutation = {
  updateMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type CreateOptionMutationVariables = {
  input: CreateOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type CreateOptionMutation = {
  createOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateOptionMutationVariables = {
  input: UpdateOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type UpdateOptionMutation = {
  updateOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type DeleteOptionMutationVariables = {
  input: DeleteOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type DeleteOptionMutation = {
  deleteOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type CreateProductMutationVariables = {
  input: CreateProductInput;
  condition?: ModelProductConditionInput | null;
};

export type CreateProductMutation = {
  createProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateProductMutationVariables = {
  input: UpdateProductInput;
  condition?: ModelProductConditionInput | null;
};

export type UpdateProductMutation = {
  updateProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput;
  condition?: ModelProductConditionInput | null;
};

export type DeleteProductMutation = {
  deleteProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateTeamMutationVariables = {
  input: UpdateTeamInput;
  condition?: ModelTeamConditionInput | null;
};

export type UpdateTeamMutation = {
  updateTeam?: {
    __typename: 'Team';
    title: string;
    teamUsers?: {
      __typename: 'ModelTeamUserConnection';
      items: Array<{
        __typename: 'TeamUser';
        teamId: string;
        userId: string;
        createdAt?: string | null;
        updatedAt?: string | null;
        owners?: Array<string | null> | null;
        id: string;
        teamTeamUsersId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ownerUserId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type DeleteTeamUserMutationVariables = {
  input: DeleteTeamUserInput;
  condition?: ModelTeamUserConditionInput | null;
};

export type DeleteTeamUserMutation = {
  deleteTeamUser?: {
    __typename: 'TeamUser';
    teamId: string;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owners?: Array<string | null> | null;
    id: string;
    teamTeamUsersId?: string | null;
  } | null;
};

export type StripeGetCheckoutSessionQueryVariables = {
  sessionId: string;
};

export type StripeGetCheckoutSessionQuery = {
  stripeGetCheckoutSession?: {
    __typename: 'StripeSession';
    id?: string | null;
    amount_subtotal: number;
    amount_total: number;
    currency: string;
    line_items?: {
      __typename: 'StripeLineItems';
      data?: Array<{
        __typename: 'StripeLineItem';
        id?: string | null;
        amount_discount?: number | null;
        amount_subtotal: number;
        amount_tax?: number | null;
        amount_total: number;
        currency: string;
        description?: string | null;
      } | null> | null;
    } | null;
    locale?: string | null;
    metadata?: string | null;
    payment_status?: StripeSessionPaymentStatus | null;
    subscription?: {
      __typename: 'StripeSubscription';
      id: string;
      cancel_at?: string | null;
      currency?: string | null;
      current_period_end?: number | null;
      current_period_start?: number | null;
      customer?: string | null;
      description?: string | null;
      ended_at?: number | null;
      metadata?: string | null;
      start_date?: number | null;
      status?: SubscriptionStatus | null;
      trial_end?: number | null;
      trial_start?: number | null;
    } | null;
  } | null;
};

export type StripeListPricesQuery = {
  stripeListPrices?: Array<{
    __typename: 'StripePrice';
    id: string;
    active: boolean;
    billing_scheme?: string | null;
    currency: string;
    metadata?: {
      __typename: 'StripePriceMeta';
      monthlyAccessQuantity?: string | null;
      userSeats?: string | null;
    } | null;
    nickname?: string | null;
    product: string;
    recurring?: {
      __typename: 'StripePriceRecurring';
      interval: StripePriceInterval;
      interval_count: number;
      usage_type: StripeUsageType;
    } | null;
    tax_behavior?: string | null;
    type?: string | null;
    unit_amount: number;
    unit_amount_decimal: number;
    currency_options?: string | null;
  } | null> | null;
};

export type StripeListProductsQuery = {
  stripeListProducts?: Array<{
    __typename: 'StripeProduct';
    id?: string | null;
    active?: boolean | null;
    default_price?: string | null;
    description?: string | null;
    livemode?: boolean | null;
    metadata: {
      __typename: 'StripeProductMeta';
      order: string;
      userType: UserType;
      subscription: string;
    };
    name?: string | null;
  } | null> | null;
};

export type StripeGetProductQueryVariables = {
  id: string;
};

export type StripeGetProductQuery = {
  stripeGetProduct?: {
    __typename: 'StripeProduct';
    id?: string | null;
    active?: boolean | null;
    default_price?: string | null;
    description?: string | null;
    livemode?: boolean | null;
    metadata: {
      __typename: 'StripeProductMeta';
      order: string;
      userType: UserType;
      subscription: string;
    };
    name?: string | null;
  } | null;
};

export type StripeGetSubscriptionQueryVariables = {
  id: string;
};

export type StripeGetSubscriptionQuery = {
  stripeGetSubscription?: {
    __typename: 'StripeSubscription';
    id: string;
    cancel_at?: string | null;
    currency?: string | null;
    current_period_end?: number | null;
    current_period_start?: number | null;
    customer?: string | null;
    description?: string | null;
    ended_at?: number | null;
    metadata?: string | null;
    start_date?: number | null;
    status?: SubscriptionStatus | null;
    trial_end?: number | null;
    trial_start?: number | null;
  } | null;
};

export type GetTranslationQueryVariables = {
  language?: string | null;
  namespace?: string | null;
};

export type GetTranslationQuery = {
  getTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type ListTranslationsQuery = {
  listTranslations?: Array<{
    __typename: 'TranslationConnection';
    language?: string | null;
    items?: Array<{
      __typename: 'Translation';
      language: string;
      namespace: string;
      data?: string | null;
    } | null> | null;
  } | null> | null;
};

export type GetAdminQueryVariables = {
  id: string;
};

export type GetAdminQuery = {
  getAdmin?: {
    __typename: 'Admin';
    country: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type ListAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListAdminsQuery = {
  listAdmins?: {
    __typename: 'ModelAdminConnection';
    items: Array<{
      __typename: 'Admin';
      country: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      role?: AdminRole | null;
      hasAccessed?: boolean | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetBillingQueryVariables = {
  id: string;
};

export type GetBillingQuery = {
  getBilling?: {
    __typename: 'Billing';
    customerId: string;
    userId: string;
    planId?: string | null;
    productId?: string | null;
    autoRenewProductId?: string | null;
    subscriptionId?: string | null;
    status?: SubscriptionStatus | null;
    teamId?: string | null;
    trialUsed?: boolean | null;
    paymentProvider?: PaymentProvider | null;
    purchaseToken?: string | null;
    plan?: PlanType | null;
    expiresAt?: string | null;
    cancelledAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type ListBillingsQueryVariables = {
  filter?: ModelBillingFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListBillingsQuery = {
  listBillings?: {
    __typename: 'ModelBillingConnection';
    items: Array<{
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type BillingsByUserIdQueryVariables = {
  userId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelBillingFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type BillingsByUserIdQuery = {
  billingsByUserId?: {
    __typename: 'ModelBillingConnection';
    items: Array<{
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type BillingsByTeamIdQueryVariables = {
  teamId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelBillingFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type BillingsByTeamIdQuery = {
  billingsByTeamId?: {
    __typename: 'ModelBillingConnection';
    items: Array<{
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetConversationQueryVariables = {
  id: string;
};

export type GetConversationQuery = {
  getConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ListConversationsQueryVariables = {
  filter?: ModelConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListConversationsQuery = {
  listConversations?: {
    __typename: 'ModelConversationConnection';
    items: Array<{
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetUserConversationQueryVariables = {
  id: string;
};

export type GetUserConversationQuery = {
  getUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type ListUserConversationsQueryVariables = {
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListUserConversationsQuery = {
  listUserConversations?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        country?: string | null;
        productId: string;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        billingId?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        teamId?: string | null;
        userType?: UserType | null;
        reportReasons?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UserConversationsByConversationIdAndCreatedAtQueryVariables = {
  conversationId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UserConversationsByConversationIdAndCreatedAtQuery = {
  userConversationsByConversationIdAndCreatedAt?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        country?: string | null;
        productId: string;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        billingId?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        teamId?: string | null;
        userType?: UserType | null;
        reportReasons?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UserConversationsByUserIdQueryVariables = {
  userId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UserConversationsByUserIdQuery = {
  userConversationsByUserId?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        country?: string | null;
        productId: string;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        billingId?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        teamId?: string | null;
        userType?: UserType | null;
        reportReasons?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetMessageQueryVariables = {
  id: string;
};

export type GetMessageQuery = {
  getMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMessagesQuery = {
  listMessages?: {
    __typename: 'ModelMessageConnection';
    items: Array<{
      __typename: 'Message';
      conversationId: string;
      text?: string | null;
      attachments?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      users: Array<string | null>;
      receiver: string;
      sender: string;
      createdBy: string;
      readBy?: Array<string | null> | null;
      createdAt: string;
      updatedAt?: string | null;
      id: string;
      conversationMessagesId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type MessagesByConversationQueryVariables = {
  conversationId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelMessageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type MessagesByConversationQuery = {
  messagesByConversation?: {
    __typename: 'ModelMessageConnection';
    items: Array<{
      __typename: 'Message';
      conversationId: string;
      text?: string | null;
      attachments?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      users: Array<string | null>;
      receiver: string;
      sender: string;
      createdBy: string;
      readBy?: Array<string | null> | null;
      createdAt: string;
      updatedAt?: string | null;
      id: string;
      conversationMessagesId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetOptionQueryVariables = {
  id: string;
};

export type GetOptionQuery = {
  getOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ListOptionsQueryVariables = {
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListOptionsQuery = {
  listOptions?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OptionsByNameQueryVariables = {
  name: string;
  label?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type OptionsByNameQuery = {
  optionsByName?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OptionsByGroupQueryVariables = {
  group: string;
  label?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type OptionsByGroupQuery = {
  optionsByGroup?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetProductQueryVariables = {
  id: string;
};

export type GetProductQuery = {
  getProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListProductsQuery = {
  listProducts?: {
    __typename: 'ModelProductConnection';
    items: Array<{
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ProductsByStatusQueryVariables = {
  status: ProductStatus;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProductFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProductsByStatusQuery = {
  productsByStatus?: {
    __typename: 'ModelProductConnection';
    items: Array<{
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ProductsByUserQueryVariables = {
  owner: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProductFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProductsByUserQuery = {
  productsByUser?: {
    __typename: 'ModelProductConnection';
    items: Array<{
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type ProductsByTeamQueryVariables = {
  teamId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelProductFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ProductsByTeamQuery = {
  productsByTeam?: {
    __typename: 'ModelProductConnection';
    items: Array<{
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTeamQueryVariables = {
  id: string;
};

export type GetTeamQuery = {
  getTeam?: {
    __typename: 'Team';
    title: string;
    teamUsers?: {
      __typename: 'ModelTeamUserConnection';
      items: Array<{
        __typename: 'TeamUser';
        teamId: string;
        userId: string;
        createdAt?: string | null;
        updatedAt?: string | null;
        owners?: Array<string | null> | null;
        id: string;
        teamTeamUsersId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ownerUserId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type ListTeamsQueryVariables = {
  filter?: ModelTeamFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTeamsQuery = {
  listTeams?: {
    __typename: 'ModelTeamConnection';
    items: Array<{
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TeamUsersByTeamIdAndCreatedAtQueryVariables = {
  teamId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTeamUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TeamUsersByTeamIdAndCreatedAtQuery = {
  teamUsersByTeamIdAndCreatedAt?: {
    __typename: 'ModelTeamUserConnection';
    items: Array<{
      __typename: 'TeamUser';
      teamId: string;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        billingId?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        teamId?: string | null;
        userType?: UserType | null;
        reportReasons?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owners?: Array<string | null> | null;
      id: string;
      teamTeamUsersId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TeamUsersByUserIdAndCreatedAtQueryVariables = {
  userId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTeamUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TeamUsersByUserIdAndCreatedAtQuery = {
  teamUsersByUserIdAndCreatedAt?: {
    __typename: 'ModelTeamUserConnection';
    items: Array<{
      __typename: 'TeamUser';
      teamId: string;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        billingId?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        teamId?: string | null;
        userType?: UserType | null;
        reportReasons?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owners?: Array<string | null> | null;
      id: string;
      teamTeamUsersId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTransactionQueryVariables = {
  id: string;
};

export type GetTransactionQuery = {
  getTransaction?: {
    __typename: 'Transaction';
    userId?: string | null;
    billingId?: string | null;
    purchaseToken?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTransactionsQuery = {
  listTransactions?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      userId?: string | null;
      billingId?: string | null;
      purchaseToken?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TransactionsByUserIdAndCreatedAtQueryVariables = {
  userId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TransactionsByUserIdAndCreatedAtQuery = {
  transactionsByUserIdAndCreatedAt?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      userId?: string | null;
      billingId?: string | null;
      purchaseToken?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TransactionsByPurchaseTokenAndCreatedAtQueryVariables = {
  purchaseToken: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TransactionsByPurchaseTokenAndCreatedAtQuery = {
  transactionsByPurchaseTokenAndCreatedAt?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      userId?: string | null;
      billingId?: string | null;
      purchaseToken?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetUserQueryVariables = {
  id: string;
};

export type GetUserQuery = {
  getUser?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    billingId?: string | null;
    billing?: {
      __typename: 'Billing';
      customerId: string;
      userId: string;
      planId?: string | null;
      productId?: string | null;
      autoRenewProductId?: string | null;
      subscriptionId?: string | null;
      status?: SubscriptionStatus | null;
      teamId?: string | null;
      trialUsed?: boolean | null;
      paymentProvider?: PaymentProvider | null;
      purchaseToken?: string | null;
      plan?: PlanType | null;
      expiresAt?: string | null;
      cancelledAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    onboardingStatus?: OnboardingStatus | null;
    teamId?: string | null;
    team?: {
      __typename: 'Team';
      title: string;
      teamUsers?: {
        __typename: 'ModelTeamUserConnection';
        nextToken?: string | null;
      } | null;
      ownerUserId?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null;
    userType?: UserType | null;
    reportReasons?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null;
};

export type ListUsersQueryVariables = {
  id?: string | null;
  filter?: ModelUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListUsersQuery = {
  listUsers?: {
    __typename: 'ModelUserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UsersByBillingIdQueryVariables = {
  billingId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UsersByBillingIdQuery = {
  usersByBillingId?: {
    __typename: 'ModelUserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UsersByTeamIdQueryVariables = {
  teamId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UsersByTeamIdQuery = {
  usersByTeamId?: {
    __typename: 'ModelUserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OnCreateMessageForConversationSubscriptionVariables = {
  conversationId: string;
};

export type OnCreateMessageForConversationSubscription = {
  onCreateMessageForConversation?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type OnCreateUserConversationForUserSubscriptionVariables = {
  userId: string;
};

export type OnCreateUserConversationForUserSubscription = {
  onCreateUserConversationForUser?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type OnCreateMessageForSenderUserSubscriptionVariables = {
  sender: string;
};

export type OnCreateMessageForSenderUserSubscription = {
  onCreateMessageForSenderUser?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type OnCreateMessageForReceiverUserSubscriptionVariables = {
  receiver: string;
};

export type OnCreateMessageForReceiverUserSubscription = {
  onCreateMessageForReceiverUser?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type OnCreateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null;
};

export type OnCreateConversationSubscription = {
  onCreateConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnUpdateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null;
};

export type OnUpdateConversationSubscription = {
  onUpdateConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnDeleteConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null;
};

export type OnDeleteConversationSubscription = {
  onDeleteConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        userId: string;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    productId: string;
    product?: {
      __typename: 'Product';
      title: string;
      category: string;
      description: string;
      images: Array<{
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      }>;
      tags: Array<string>;
      country?: string | null;
      status: ProductStatus;
      owner?: string | null;
      teamId?: string | null;
      expiresAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnCreateUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null;
};

export type OnCreateUserConversationSubscription = {
  onCreateUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type OnUpdateUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null;
};

export type OnUpdateUserConversationSubscription = {
  onUpdateUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type OnDeleteUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null;
};

export type OnDeleteUserConversationSubscription = {
  onDeleteUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        nextToken?: string | null;
      } | null;
      productId: string;
      product?: {
        __typename: 'Product';
        title: string;
        category: string;
        description: string;
        tags: Array<string>;
        country?: string | null;
        status: ProductStatus;
        owner?: string | null;
        teamId?: string | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      billingId?: string | null;
      billing?: {
        __typename: 'Billing';
        customerId: string;
        userId: string;
        planId?: string | null;
        productId?: string | null;
        autoRenewProductId?: string | null;
        subscriptionId?: string | null;
        status?: SubscriptionStatus | null;
        teamId?: string | null;
        trialUsed?: boolean | null;
        paymentProvider?: PaymentProvider | null;
        purchaseToken?: string | null;
        plan?: PlanType | null;
        expiresAt?: string | null;
        cancelledAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      onboardingStatus?: OnboardingStatus | null;
      teamId?: string | null;
      team?: {
        __typename: 'Team';
        title: string;
        ownerUserId?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        owner?: string | null;
      } | null;
      userType?: UserType | null;
      reportReasons?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null;
};

export type OnCreateMessageSubscription = {
  onCreateMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null;
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type OnCreateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null;
  owner?: string | null;
};

export type OnCreateProductSubscription = {
  onCreateProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnUpdateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null;
  owner?: string | null;
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnDeleteProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null;
  owner?: string | null;
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?: {
    __typename: 'Product';
    title: string;
    category: string;
    description: string;
    images: Array<{
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    }>;
    tags: Array<string>;
    country?: string | null;
    status: ProductStatus;
    owner?: string | null;
    teamId?: string | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type OnUpdateTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null;
  owner?: string | null;
};

export type OnUpdateTeamSubscription = {
  onUpdateTeam?: {
    __typename: 'Team';
    title: string;
    teamUsers?: {
      __typename: 'ModelTeamUserConnection';
      items: Array<{
        __typename: 'TeamUser';
        teamId: string;
        userId: string;
        createdAt?: string | null;
        updatedAt?: string | null;
        owners?: Array<string | null> | null;
        id: string;
        teamTeamUsersId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ownerUserId?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};
