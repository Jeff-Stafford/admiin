import { Auth } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { vi } from 'vitest';
import 'vitest-canvas-mock';

beforeAll(async () => {
  Amplify.configure({
    aws_project_region: 'us-east-1',
    aws_appsync_graphqlEndpoint:
      'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
    aws_appsync_region: 'us-east-1',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    //aws_cloud_logic_custom: [
    //  {
    //    name: 'AppRestAPI',
    //    endpoint: 'https://5b2zevx2sj.execute-api.us-east-1.amazonaws.com/new',
    //    region: 'us-east-1',
    //  },
    //],
    aws_cognito_identity_pool_id:
      'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    aws_cognito_region: 'us-east-1',
    aws_user_pools_id: 'us-east-1_xxxxxxxxx',
    aws_user_pools_web_client_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    oauth: {},
    aws_cognito_username_attributes: ['EMAIL', 'PHONE_NUMBER'],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: [],
    aws_cognito_mfa_configuration: 'OPTIONAL',
    aws_cognito_mfa_types: ['SMS', 'OTP'],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: [
        'REQUIRES_LOWERCASE',
        'REQUIRES_UPPERCASE',
        'REQUIRES_NUMBERS',
        'REQUIRES_SYMBOLS',
      ],
    },
    aws_cognito_verification_mechanisms: ['EMAIL'],
    aws_user_files_s3_bucket: 'xxxxxx-xxxxx-xxx',
    aws_user_files_s3_bucket_region: 'us-east-1',
  });
});

vi.spyOn(Auth, 'currentAuthenticatedUser').mockImplementation(async () => ({
  attributes: {
    sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
  },
}));
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('react-hook-form', async () => {
  const actual: any = await vi.importActual('react-hook-form'); // Import the actual module
  // Create a mock Controller component
  return {
    ...actual, // Spread all actual exports
    useFormContext: () => ({
      ...actual.useFormContext(),
      control: {
        ...actual.useForm().control,
        register: vi.fn(),
        unregister: vi.fn(),
        getValues: vi.fn(),
      },
      handleSubmit: vi.fn(),
      trigger: vi.fn(),
      formState: { errors: {} },
      setValue: vi.fn(),
    }),
    useWatch: () => ({
      type: 'SIGN_ONLY',
    }),
    Controller: actual.Controller, // Use the mocked Controller
  };
});

vi.mock('react-i18next', async () => ({
  ...((await vi.importActual('react-i18next')) as any),
  useTranslation: () => ({
    t: vi.fn((key) => key),
    i18n: {
      language: 'en-us',
      changeLanguage: vi.fn(),
    },
  }),
}));

// mock pspdfkit
vi.mock('pspdfkit', () => ({
  load: vi.fn().mockImplementation(() =>
    Promise.resolve({
      create: vi.fn(),
      createAttachment: vi.fn(),
      addEventListener: vi.fn(),
      viewState: {
        set: vi.fn(),
      },
      setViewState: vi.fn(),
      transformContentClientToPageSpace: vi.fn(),
      // other instance methods...
    })
  ),
  unload: vi.fn(),
  defaultToolbarItems: [{ type: 'annotate' }, { type: 'pan' }],
  ViewState: vi.fn(),
  Annotations: {
    WidgetAnnotation: vi.fn(),
    InkAnnotation: vi.fn(),
    ImageAnnotation: vi.fn(),
    toSerializableObject: vi.fn(),
  },
  Geometry: {
    Rect: vi.fn(),
    DrawingPoint: vi.fn(),
  },
  Immutable: {
    List: vi.fn(),
  },
  generateInstantId: vi.fn(),
  FormFields: {
    SignatureFormField: vi.fn(),
  },
  InteractionMode: {
    FORM_CREATOR: 'FORM_CREATOR',
  },
  ElectronicSignatureCreationMode: {
    DRAW: 'DRAW',
    IMAGE: 'IMAGE',
    TYPE: 'TYPE',
  },
}));

// Mock React Konva for Typing signature

vi.mock('react-konva', () => ({}));

afterEach(() => {
  vi.restoreAllMocks();
});
