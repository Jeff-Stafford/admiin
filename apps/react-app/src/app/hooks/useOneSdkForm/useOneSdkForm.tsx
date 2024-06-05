import {
  BeneficialOwner,
  Entity,
  createVerificationToken as CREATE_VERIFICATION_TOKEN,
} from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import { tick } from '@apollo/client/testing';
import React from 'react';

interface UseOneSdkFormProps {
  //   owner: BeneficialOwner | null | undefined;
  entity: Entity | null | undefined;
  mode: 'legacy' | 'oneSdk' | 'react';
}

export const useOneSdkForm = ({ entity, mode }: UseOneSdkFormProps) => {
  const ref = React.useRef<any>();
  const widgetConfiguration = {
    frankieBackendUrl: 'https://backend.kycaml.uat.frankiefinancial.io', //TODO: production url support
    documentTypes: [
      'NATIONAL_HEALTH_ID',
      { type: 'PASSPORT', acceptedCountries: 'ALL' },
      'DRIVERS_LICENCE',
    ],
    idScanVerification: false,
    checkProfile: 'auto',
    maxAttemptCount: 5,
    googleAPIKey: false,
    phrases: {
      document_select: {
        title: 'Custom Text Here: Choose your ID',
        hint_message: "Choose which ID you'd like to provide.",
      },
    },
    requestAddress: { acceptedCountries: ['AUS', 'NZL'] },
    consentText:
      'I consent to the collection, use, and disclosure of my personal information in accordance with Admiin’s (SIGNPAY PTY LTD) Privacy Policy, and consent to my personal information being disclosed to a credit reporting agency or my information being checked with the document issuer or official record holder via third party systems in connection with a request to verify my identity in accordance with the AML/CTF Act.',
    //"I consent to my personal data being used as stated in Signpay Pty Ltd's (Admiin) Privacy Policy. For identity verification, I permit:\n" +
    //'• Checking my details against official records via third parties;\n' +
    //"• Signpay's agents acting as intermediaries as per Australian\n" +
    //'Privacy Principles',
  };
  const [form, setForm] = React.useState<any>();
  const initModularForm = (oneSdk: any) => {
    oneSdk.on('*', console.log);

    const form_welcome = oneSdk.component('form', {
      name: 'WELCOME',
      type: 'ocr',
      /*descriptions: [
                { label: 'This is a sample dynamic page.', style: {} },
                { label: 'It can contain multiple paragraphs.', style: {} },
              ], */
      //cta: {style: {'ff-button':{backgroundColor: "red"}}}
    });
    const form_consent = oneSdk.component('form', { name: 'CONSENT' });
    const form_loading1 = oneSdk.component('form', {
      name: 'LOADING',
      title: { label: 'Loading...' },
      descriptions: [{ label: '' }],
    });
    const form_loading2 = oneSdk.component('form', {
      name: 'LOADING',
      title: { label: 'Extracting data...' },
      descriptions: [
        {
          label:
            "Hold tight, this can take up to 30 seconds. Please do not referesh this page or click the 'back' button on your browser.",
        },
      ],
    });
    const form_loading3 = oneSdk.component('form', {
      name: 'LOADING',
      title: { label: 'Hold on...' },
      descriptions: [{ label: '' }],
    });

    const form_document = oneSdk.component('form', {
      name: 'DOCUMENT',
      showPreps: true,
    });
    const form_review1 = oneSdk.component('form', {
      name: 'REVIEW',
      type: 'ocr',
    });
    const form_review2 = oneSdk.component('form', {
      name: 'REVIEW',
      type: 'ocr',
      personal: {
        countries: {
          default: {
            default: {
              fields: [
                {
                  fieldType: 'address',
                  name: 'address.fullAddress',
                  hide: true,
                },
              ],
            },
          },
        },
      },
    });
    const form_review3 = oneSdk.component('form', {
      name: 'REVIEW',
      type: 'ocr',
      personal: {
        countries: {
          default: {
            default: {
              fields: [
                {
                  fieldType: 'date',
                  name: 'dateOfBirth',
                  hide: true,
                },
                {
                  fieldType: 'address',
                  name: 'address.fullAddress',
                  hide: true,
                },
              ],
            },
          },
        },
      },
    });
    const biometrics = oneSdk.component('biometrics');

    form_welcome.mount(ref.current);
    form_welcome.on('form:welcome:ready', () => {
      form_consent.mount(ref.current);
    });

    form_consent.on('form:consent:ready', async () => {
      form_document.mount(ref.current);
    });

    form_welcome.on('form:welcome:failed', () => {
      // display error message
    });

    form_welcome.on('*', (message: any) => {
      console.log(message);
    });

    let docType: any;

    form_document.on(
      'form:document:ready',
      async ({ inputInfo }: { inputInfo: any }) => {
        form_loading1.mount(ref.current);
        docType = inputInfo.documentType;
        const ocr = oneSdk.component('ocr', {
          documents: [{ type: docType, countries: ['AUS'] }],
        });
        console.log(inputInfo.documentType);

        ocr.mount(ref.current);
        ocr.on('ready', () => form_loading1.unmount());

        ocr.on('*', (message: any) => {
          console.log(message);
        });

        ocr.on('results', ({ document }: { document: any }) => {
          doSomethingAfterOcr({ document });
        });

        ocr.on('loading', (display: any) => {
          if (display) {
            form_loading2.mount(ref.current);
          } else {
            form_loading2.unmount();
          }
        });
      }
    );

    function doSomethingAfterOcr({ document }: { document: any }) {
      // Present the details of the document that were detected from the uploaded image or images.
      // Decide whether to proceed to the next stage of the onboarding process
      // depending on whether document verification was successful.
      if (document) {
        console.log(document);
        console.log(document.ocrResult.dateOfBirth);
        console.log('trying to load review screen');
        if (docType == 'DRIVERS_LICENCE') form_review1.mount(ref.current);
        else if (docType == 'PASSPORT') {
          form_review2.mount(ref.current);
        } else {
          form_review3.mount(ref.current);
        }
      } else {
        console.log('No document returned');
      }
    }

    form_review1.on('form:review:ready', async () => {
      biometrics.mount(ref.current);
    });

    biometrics.on('*', (message: any) => {
      console.log(message);
    });

    biometrics.on('error', console.error);

    let error = false;
    biometrics.on('detection_failed', () => (error = true));
    biometrics.on('session_closed', () => {
      // If the session was closed due to an error, try running the biometrics component again.
      if (error) biometrics.mount(ref.current);
      error = false;
    });

    biometrics.on('loading', (display: any) => {
      if (display) {
        //alert("loading, show now")
        form_loading3.mount(ref.current);
      } else {
        form_loading3.unmount();
      }
    });

    biometrics.on('processing', () =>
      alert('We will get back to you with results soon')
    );
    biometrics.on('results', (result: any) => {
      // Decide whether to proceed to the next stage of the onboarding process
      // depending on whether biometrics verification was successful.
      console.log(result);
    });
  };
  const ff_phrases_object = {
    common: {
      next_button_cta: 'Next',
      confirm_button_cta: "Yes, that's correct",
      save_button_cta: 'Save',
      edit_button_cta: 'Edit',
      cancel_button_cta: 'Cancel',
      mandatory_field: '*',
    },
    applicant: {
      name: 'Name',
      english_name: 'English Name',
      native_name: 'Native Name',
      date_of_birth: 'Date of Birth',
      date_of_birth_buddhist: 'Buddhist Date of Birth',
      current_address: 'Current Residential Address',
      previous_address: 'Previous Residential Address',
      gender: 'Gender',
      marital_status: 'Marital status',
    },
    document: {
      number: 'Number',
      type_passport: {
        label: 'Passport',
        subtitle: '',
        number: 'Passport Number',
        country: 'Country of Issue',
        expiry: 'Date of Expiry',
      },
      type_drivers_licence: {
        heading: "Driver's licence",
        label: "Driver's Licence",
        subtitle: '(recommended)',
        state: 'State or Territory of Issue',
        licence_number: 'Licence Number',
        card_number: 'Card Number',
        country: 'Country of Issue',
        version_number: 'Version Number',
        digital_consent:
          "This is a digital licence and I don't have my physical licence with me.",
        digital_notification_banner:
          'A physical licence is required to open an account. You may complete the application however you may need to provide additional information.',
      },
      type_medicare: {
        label: 'Medicare Card',
        subtitle: '',
        number: 'Number',
        colour: 'Colour',
        position: 'Position',
        expiry: 'Expiry Date',
        name: 'Name as shown on card',
      },
      type_national_id: {
        label: 'National ID',
        subtitle: '(Citizen / Permanent resident)',
        laser_code: 'Laser Code',
        country: 'Country of Citizenship',
        identification_number: 'Identification Number',
        name: 'Name as shown on card',
        nationality: 'Nationality',
      },
    },
    document_select: {
      title: 'Choose your IDabcsdfs',
      title_extra: 'Looks like you need to try a different ID',
      subtitle:
        "We'll need at least one of the following documents to verify your identity.",
      hint_message: "Choose which ID you'd like to provide.",
      footer_text: 'Your ID must be valid and not expired',
    },
    document_uploads: {
      title: 'Upload your document',
      guide_text:
        'Please choose and upload one of the following documents to complete your verification.',
      select_placeholder: 'Select document type',
      upload_cta: 'Upload',
      upload_success: 'Successfully uploaded',
      generic_error: 'There was a problem uploading your file',
      summary_title: 'Documents uploaded',
      unsupported_file_type: 'Uploaded file is of invalid type',
    },
    name_input_screen: {
      title: 'Your name',
      dual_name_english_title: 'Your English name',
      dual_name_native_title: 'Your Native name',
      title_loop: 'Check your name',
      dual_name_english_title_loop: 'Check your English name',
      dual_name_native_title_loop: 'Check your Native name',
      subtitle:
        'What is your full legal name as it is shown exactly on your ID.',
      honorific_title_label: 'Title',
      given_name_label: 'Given Name',
      given_name_confirmation_label: '(as shown on ID)',
      middle_name_label: 'Middle Name or Initial',
      middle_name_confirmation_label: '(only include if shown on ID)',
      family_name_label: 'Surname',
      family_name_confirmation_label: '(as shown on ID)',
      medicare_middle_name_label:
        'How is your middle name displayed on your Medicare Card?',
    },
    passport_input_screen: {
      title: 'Your passport details',
      title_loop: 'Check your passport details',
      expiry_date_placeholder: 'DD/MM/YYYY',
      australian_passport_number_invalid_message:
        'This passport number is invalid',
    },
    current_address_screen: {
      title: 'Your current residential address',
      title_loop: 'Check your current residential address',
    },
    previous_address_screen: {
      title_first_time: 'What is your previous residential address?',
      title: 'Your previous residential address',
      title_loop: 'Check your current residential address',
      question_has_previous_address:
        'Have you been at your address for less than 6 months?',
    },
    date_of_birth_input_screen: {
      title: 'Your date of birth',
      title_loop: 'Check your date of birth',
      full_date_label: 'Day / Month / Year',
      full_date_label_buddhist:
        'Day / Month / Year (Day and month are optional)',
      day_label: 'DD',
      month_label: 'MM',
      year_label: 'YYYY',
      message_label: 'Your birthday is the {0}, making you {1} years old',
      minimum_age_error_label:
        'You must be over {0} years old to open an account',
      error_message_label:
        'Oops, looks like there might have been a mistake, try again',
      buddhist: 'Buddhist',
      gregorian: 'Gregorian',
    },
    medicare_input_screen: {
      title: 'Your Medicare card details',
      title_loop: 'Check your Medicare card details',
    },
    drivers_licence_input_screen: {
      title: "Your driver's licence details",
      title_loop: "Check your driver's licence details",
      state_screen_title: "What state was your driver's licence issued?",
      licence_number: {
        placeholder: {
          AUS: {
            ACT: 'e.g. 1234567890',
            NSW: 'e.g. 1234567890',
            NT: 'e.g. 1234567',
            QLD: 'e.g. 123456789',
            SA: 'e.g. W12345',
            TAS: 'e.g. 1234567',
            VIC: 'e.g. 1234567890',
            WA: 'e.g. 1234567',
          },
        },
        error: 'This licence number is invalid',
      },
      document_number: {
        placeholder: {
          AUS: {
            ACT: 'e.g. A123456789',
            NSW: 'e.g. 1234567890',
            NT: 'e.g. 12345678',
            QLD: 'e.g. FCC1234567',
            SA: 'e.g. D12345678',
            TAS: 'e.g. D12345678',
            VIC: 'e.g. P1234567',
            WA: 'e.g. L123456789',
          },
        },
        hint: {
          AUS: {
            ACT: 'The card number is located on the front of your card, running vertically alongside your photo.',
            NSW: 'The card number is located on the front of your card, in the top right corner above your photo.',
            NT: 'The card number is located on the back of your card, either in the bottom left corner or bottom middle.',
            QLD: 'The card number is located in the bottom middle on the front, or the bottom right of the back of your card.',
            SA: 'The card number is located on the back of your card, in the top right corner.',
            TAS: 'The card number is located on the back of your card, in the top right corner.',
            VIC: 'The card number is located on the back of your card, either in the top right corner or middle right.',
            WA: 'The card number is located on the back of your card, in the middle of the right side.',
          },
        },
        error: 'This card number is invalid',
      },
    },
    national_id_input_screen: {
      title: 'Your national ID details',
      title_loop: 'Check your National ID details',
    },
    address_manual_input_screen: {
      unit_label: 'Unit Number',
      street_number_label: 'Street Number',
      street_name_label: 'Street Name',
      country_placeholder: 'Country',
      suburb_label: 'Suburb',
      town_label: 'Suburb / Town',
      state_label: 'State',
      postcode_label: 'Postcode',
      country_label: 'Country',
      full_address_label: 'Full address',
      unit_placeholder: 'Unit',
      street_number_placeholder: 'Street Number',
      street_name_placeholder: 'Street Name',
      suburb_placeholder: 'Suburb',
      town_placeholder: 'Suburb / Town',
      state_placeholder: 'State',
      postcode_placeholder: 'Postcode',
      full_address_placeholder: 'Full address',
    },
    address_autocomplete_input_screen: {
      switch_to_manual: 'Enter address manually',
      autocomplete_label: 'Cannot be a PO Box',
      autocomplete_placeholder: 'Start typing your address...',
      autocomplete_no_match_message:
        'No results found. Click here to add address manually.',
    },
    review_details_screen: {
      title: 'Are these details correct?',
      personal_info_label: 'Your Personal Info',
      submit_button_idle: 'Verifying',
      submit_button_cta: 'Looks good, verify my identity',
      edit_title_name: 'Edit your name',
      edit_title_dual_name_english: 'Edit your English name',
      edit_title_dual_name_native: 'Edit your native name',
      edit_title_dob: 'Edit your date of birth',
      edit_title_current_address: 'Edit your current residential address',
      edit_title_previous_address: 'Edit your previous residential address',
      edit_title_passport: 'Edit your passport details',
      edit_title_drivers_licence: "Edit your driver's licence details",
      edit_title_national_health_id: 'Edit your Medicare details',
      edit_title_national_id: 'Edit your national ID details',
      loading_verification:
        '<h1>Verifying your identity...!!!</h1><p>Please do not close or refresh this page.</p>',
    },
    success_screen: {
      title: 'Woohoo!',
      title_credit_header: 'Your identity has been verified',
      subtitle: 'Your identity has been verified.',
      credit_header_title: 'Please Note:',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        "There is nothing you need to do, however if you'd like more information please feel free to get in touch with our customer service team.",
    },
    failure_screen: {
      title: 'Oh no!',
      subtitle: "Unfortunately we couldn't verify your identity at this time.",
      failure_hint:
        'Please contact our customer support team who will be happy to help you open your account.',
      credit_header_title: 'Please Note:',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        "There is nothing you need to do, however if you'd like more information please feel free to get in touch with our customer service team.",
    },
    pending_screen: {
      title: "You're all done...",
      innner_p_1:
        'There are still a couple of things we need to check before opening your account.',
      innner_p_2: "We'll let you know once it's complete.",
      credit_header_title: 'Please Note:',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        "There is nothing you need to do, however if you'd like more information please feel free to get in touch with our customer service team.",
    },
    partial_match_screen: {
      title: "We couldn't verify your identity",
      subtitle:
        " Most of the time it's just a typo, let's check your details have been entered correctly.",
      credit_header_title: 'Please Note:',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        "There is nothing you need to do, however if you'd like more information please feel free to get in touch with our customer service team.",
      cta_text: 'Check your ID information',
    },
    no_match_screen: {
      title: "We're having trouble verifying your identity",
      subtitle:
        " Most of the time it's just a typo, let's check your details have been entered correctly.",
      credit_header_title: 'Please Note:',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        "There is nothing you need to do, however if you'd like more information please feel free to get in touch with our customer service team.",
    },
    credit_header_failure_screen: {
      title: 'Before we proceed...',
      credit_header_description_p_1:
        "The details you provided didn't match the records held on file by one or all of the credit reporting agencies we checked (Illion, Equifax and/or Experian).",
      credit_header_description_p_2:
        "Don't worry, this doesn't mark or affect credit history in any way. However this could be why we've had trouble verifying your identity.",
      credit_header_description_p_3:
        'Please contact our customer support team who will be happy to help.',
      cta_text: 'Proceed',
    },
    unauthorize_error_screen: {
      title: 'This link has expired.',
      sub_titlte_p_1: 'You will need to get a new link to proceed.',
      sub_titlte_p_2: 'Links last 2 hours.',
    },
    error_label: {
      missing: '{fieldName} is required',
      invalid: '{fieldName} is invalid',
      incomplete: '{fieldName} is incomplete',
      expired: '{documentName} is expired',
    },
    errors: {
      default: {
        text: 'Something went wrong.',
        explanation: 'Please try refreshing or contact our support team.',
        cta: 'Refresh',
        url: '',
      },
      '400': {
        text: 'Token is not authorised',
        explanation: 'Please re-initialise with a different token',
      },
      '1023 - 404': {
        text: "Can't retrieve original document",
        explanation: 'Contact help desk',
      },
    },
  };
  const phrases_v2 = {
    failure_screen: {
      title: 'Oh no!',
      subtitle: "Unfortunately we couldn't verify your identity at this time.",
      failure_hint:
        'Please contact our customer support team who will be happy to help you open your account.',
    },
  };

  const ff_config_object = {
    mode: 'development',
    ageRange: [18, 125],
    checkProfile: 'auto',
    phrases: ff_phrases_object,
    welcomeScreen: true,
    maxAttemptCount: 3,
    documentTypes: [
      {
        icon: 'driving-licence',
        label: 'document.type_drivers_licence.label',
        subtitle: 'document.type_drivers_licence.subtitle',
        type: 'DRIVERS_LICENCE',
      },
      {
        idExpiry: true,
        icon: 'passport',
        label: 'document.type_passport.label',
        subtitle: '',
        type: 'PASSPORT',
        acceptedCountries: ['AUS'],
      },
    ],
    successScreen: {
      ctaUrl: null,
      ctaText: 'Continue to My Account',
    },
    failureScreen: true,
    progressBar: true,
    googleAPIKey: 'AIzaSyA2cGPxLCgNhxLoJJtQmOoMAQPoP_MtVE0',
    acceptedCountries: ['AUS'],

    organisationName: 'Organisation',
    dateOfBirth: {
      type: 'gregorian',
    },
    pendingScreen: {
      htmlContent: null,
      ctaActions: [],
    },
    //"consentText": "help",
    requestAddress: {
      acceptedCountries: ['AUS'],
    },
    documentUploads: false,
    lazyIDCheck: false,
    requestID: true,
    disableThirdPartyAnalytics: false,
    saveOnly: false,
  };
  const initSmartUIForm = (oneSdk: any) => {
    const smartUIform = oneSdk.component('form', ff_config_object);

    smartUIform.on('*', (message: any) => {
      console.log(message);
    });

    smartUIform.on(
      'results',
      async (applicant: any, documents: any, entityId: any) => {
        console.log(applicant);
        console.log(documents);
        console.log(entityId);

        const oneSdkIndividual = oneSdk.individual().access(entityId);
        const entity = oneSdkIndividual?.getValue();
        console.log(entity);
        console.log(await oneSdkIndividual?.search());
        /*const checkResults = oneSdkIndividual.submit({
          verify: true
        });
        console.log(checkResults);*/
      }
    );
    smartUIform.mount(ref.current);
  };

  const [createVerificationToken] = useMutation(gql(CREATE_VERIFICATION_TOKEN));
  const verifyOwner = async (owner: BeneficialOwner) => {
    const tokenData = await createVerificationToken({
      variables: {
        input: {
          beneficialOwnerId: owner.id,
          entityId: entity?.id,
          preset: 'SMART_UI',
        },
      },
    });
    const token = tokenData?.data?.createVerificationToken?.token;

    if (mode === 'react') {
      const oneSdk = await window.OneSdk({
        session: { token },
        mode: 'development',
        recipe: {
          ocr: {
            maxDocumentCount: 3,
          },
          form: {
            provider: {
              name: 'react',
              reference: owner?.id,
            },
          },
        },
      });
      initModularForm(oneSdk);
    } else if (mode === 'oneSdk') {
      const oneSdk = await window.OneSdk({
        session: { token },
        mode: 'development',
        recipe: {
          form: {
            provider: {
              name: 'legacy',
              version: 'v4',
              reference: owner?.id,
            },
          },
        },
      });
      console.log(JSON.stringify(oneSdk));
      initSmartUIForm(oneSdk);
    } else {
      await window.frankieFinancial.initialiseOnboardingWidget({
        applicantReference: owner?.id,
        config: widgetConfiguration,
        width: '100%',
        height: '100%',
        ffToken: token,
      });
    }
  };
  return { verifyOwner, form, ref };
};
