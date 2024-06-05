const {
  ENV,
  TABLE_ENTITY,
  TABLE_OPTION,
  TABLE_PRODUCT,
  ZAI_WEBHOOK_LISTENER_DOMAIN,
} = process.env;
const isProd = ENV === 'prod';
import { CreateZaiAuthTokenResponse, initZai } from '/opt/zai';
import { createZaiFee, listZaiFees } from '/opt/zai/fee';
import {
  createZaiWebhook,
  createZaiWebhookSecret,
  GetZaiWebhookResponse,
} from '/opt/zai/webhook';
import { Handler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { batchPut, createRecord } from '/opt/dynamoDB';

const interests = [
  'Electronics',
  'Home and Garden',
  'Fashion and Apparel',
  'Health and Beauty',
  'Sports and Outdoors',
  'Toys and Games',
  'Automotive and Accessories',
  'Books and Media',
  'Food and Beverages',
  'Pet Supplies',
];
const categories = [
  'Wireless Charging',
  'Smart Home',
  'Outdoor Furniture',
  "Women's Clothing",
  'Skincare',
  'Yoga Mats',
  'Car Care',
  'Mystery Novels',
  'Organic Food',
  'Dog Toys',
  'Headphones',
  'Gardening Tools',
  "Men's Shoes",
  'Makeup Brushes',
  'Fitness Equipment',
  'Board Games',
  'Car Accessories',
  'Cooking Utensils',
  'Snack Foods',
  'Cat Supplies',
  'Laptops',
  'Home Decor',
  'Athletic Wear',
  'Haircare',
  'Camping Gear',
];

const mockProducts = [
  {
    title: 'Smart Wireless Headphones',
    category: 'Electronics',
    description:
      'High-quality headphones with active noise cancellation and wireless charging capability.',
    images: [],
    tags: ['Wireless Charging', 'Headphones'],
    country: 'USA',
    status: 'ACTIVE',
    owner: 'owner',
    price: 200.51,
    createdAt: '2023-10-01T09:45:00Z',
    updatedAt: '2023-10-20T14:20:00Z',
    id: randomUUID(),
  },
  {
    title: 'Eco-friendly Yoga Mat',
    category: 'Sports and Outdoors',
    description:
      'Made from sustainable materials, this yoga mat provides excellent grip and cushioning.',
    images: [],
    tags: ['Yoga Mats', 'Athletic Wear'],
    country: 'Canada',
    status: 'REVIEW',
    owner: 'owner',
    price: 120.54,
    createdAt: '2023-09-15T12:30:00Z',
    updatedAt: '2023-10-15T11:10:00Z',
    id: randomUUID(),
  },
  {
    title: 'Mystery Adventure Novel',
    category: 'Books and Media',
    description:
      'A thrilling page-turner that keeps you at the edge of your seat till the very end.',
    images: [],
    tags: ['Mystery Novels'],
    country: 'UK',
    status: 'DRAFT',
    owner: 'owner',
    price: 50.23,
    createdAt: '2023-08-20T10:20:00Z',
    updatedAt: '2023-10-12T10:10:00Z',
    id: randomUUID(),
  },
  {
    title: 'Organic Cat Food',
    category: 'Pet Supplies',
    description:
      'A blend of high-quality organic ingredients to keep your feline friend healthy and satisfied.',
    images: [],
    tags: ['Organic Food', 'Cat Supplies'],
    country: 'Australia',
    status: 'ACTIVE',
    owner: 'owner',
    price: 15.0,
    createdAt: '2023-07-01T11:35:00Z',
    updatedAt: '2023-10-22T13:15:00Z',
    id: randomUUID(),
  },
  {
    title: "Men's Athletic Shoes",
    category: 'Fashion and Apparel',
    description:
      'Comfortable, durable, and stylish athletic shoes perfect for both workouts and casual wear.',
    images: [],
    tags: ["Men's Shoes", 'Athletic Wear'],
    country: 'Germany',
    status: 'ARCHIVED',
    owner: 'owner',
    price: 45.2,
    createdAt: '2023-06-05T14:55:00Z',
    updatedAt: '2023-10-18T12:45:00Z',
    id: randomUUID(),
  },
];

let zaiAuthToken: CreateZaiAuthTokenResponse;
let zaiClientSecret: string;
let zaiWebhookSecret: string;

export const handler: Handler = async (event) => {
  console.log('EVENT RECEIVED: ', event);

  if (event.trigger === 'OPTIONS') {
    // interests tags
    try {
      const items = interests.map((interest) => ({
        id: randomUUID(),
        group: 'Interests',
        label: interest,
        value: interest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __typename: 'Option',
      }));
      await batchPut({ tableName: TABLE_OPTION ?? '', items });
    } catch (err: any) {
      console.log('ERROR batch create interests: ', err);
      throw new Error(err.message);
    }

    // categories
    try {
      const items = categories.map((category) => ({
        id: randomUUID(),
        group: 'Categories',
        label: category,
        value: category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __typename: 'Option',
      }));
      await batchPut({ tableName: TABLE_OPTION ?? '', items });
    } catch (err: any) {
      console.log('ERROR batch create categories: ', err);
      throw new Error(err.message);
    }
  }

  //create mock / existing products
  if (event.trigger === 'PRODUCTS') {
    try {
      await batchPut({ tableName: TABLE_PRODUCT ?? '', items: mockProducts });
    } catch (err: any) {
      console.log('ERROR batch create products: ', err);
      throw new Error(err.message);
    }
  }

  if (event.trigger === 'ZAI_FEE') {
    // set zai api auth
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;

    // list fee to make sure it doesn't exist

    let zaiFees = [];
    try {
      const data = await listZaiFees(zaiAuthToken?.access_token, {
        limit: 200,
        offset: 0,
      });
      zaiFees = data.fees;
      console.log('zaiFees: ', zaiFees);
    } catch (err: any) {
      console.log('ERROR listZaiFees: ', err);
      throw new Error(err.message);
    }

    // card 2.2%
    if (!zaiFees.find((fee) => fee.name === 'CARD_220')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_220',
          fee_type_id: '2',
          amount: 220, // 2.2%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_220 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_220 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // card 2.1%
    if (!zaiFees.find((fee) => fee.name === 'CARD_210')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_210',
          fee_type_id: '2',
          amount: 210, // 2.1%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_210 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_210 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // card 2.0%
    if (!zaiFees.find((fee) => fee.name === 'CARD_200')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'CARD_200',
          fee_type_id: '2',
          amount: 200, // 2.0%
          to: 'buyer',
        });
        console.log('createZaiFee CARD_200 response: ', response);
      } catch (err: any) {
        console.log('ERROR CARD_200 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 90 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_90')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_90',
          fee_type_id: '1',
          amount: 90, // 90 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 60 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_60')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_60',
          fee_type_id: '1',
          amount: 60, // 60 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // bank 30 cents
    if (!zaiFees.find((fee) => fee.name === 'BANK_30')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BANK_30',
          fee_type_id: '1',
          amount: 30, // 30 cents
          to: 'buyer',
        });
        console.log('createZaiFee BANK_90 response: ', response);
      } catch (err: any) {
        console.log('ERROR BANK_90 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // ato plan 88 dollars
    if (!zaiFees.find((fee) => fee.name === 'ATO_PLAN_88')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'ATO_PLAN_88',
          fee_type_id: '1',
          amount: 8800, // 88 dollars
          to: 'buyer',
        });
        console.log('createZaiFee ATO_PLAN_88 response: ', response);
      } catch (err: any) {
        console.log('ERROR ATO_PLAN_88 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // business plan 2.6%
    if (!zaiFees.find((fee) => fee.name === 'BUSINESS_PLAN_260')) {
      try {
        const response = await createZaiFee(zaiAuthToken?.access_token, {
          name: 'BUSINESS_PLAN_260',
          fee_type_id: '2',
          amount: 260, // 2.6%
          to: 'buyer',
        });
        console.log('createZaiFee BUSINESS_PLAN_260 response: ', response);
      } catch (err: any) {
        console.log('ERROR BUSINESS_PLAN_260 createZaiFee: ', err);
        throw new Error(err.message);
      }
    }

    // installments
  }

  if (event.trigger === 'ZAI_WEBHOOKS') {
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;

    if (!zaiWebhookSecret) {
      throw new Error(
        'Zai Webhook Secret not found, cannot create webhook endpoints'
      );
    }
    // create zai webhook secret
    try {
      const response = await createZaiWebhookSecret(
        zaiAuthToken?.access_token,
        {
          secret_key: zaiWebhookSecret,
        }
      );
      console.log('createZaiWebhookSecret response: ', response);
    } catch (err: any) {
      console.log('ERROR createZaiWebhookSecret: ', err);
      throw new Error(err.message);
    }

    // create zai webhooks
    const requests: Promise<GetZaiWebhookResponse>[] = [];
    const endpoints = [
      'accounts',
      'batch_transactions',
      'items',
      'users',
      'transactions', //to be notified of incoming funds debited from your user’s bank account and reconciled on the digital wallet that’s associated with the user.
      'disbursements',
      'virtual_accounts',
      'pay_ids',
      'payto_agreements', // to be notified about the agreement status changes
      'payto_payments', // to be notified about payment initiation request status changes.
      'transaction_failure_advice', // to be notified if the PayTo payment reconciliation failed on your user's wallet.
    ];

    const zaiEnv = isProd ? 'prod' : 'dev';
    console.log('ZAI_WEBHOOK_LISTENER_DOMAIN: ', ZAI_WEBHOOK_LISTENER_DOMAIN);

    endpoints.forEach((endpoint) => {
      const request = createZaiWebhook(zaiAuthToken?.access_token, {
        url: `https://${ZAI_WEBHOOK_LISTENER_DOMAIN}` ?? '',
        object_type: endpoint,
        description: `${zaiEnv.toUpperCase()}_${endpoint.toUpperCase()}_WEBHOOK`,
      });

      requests.push(request);
    });

    // create zai webhooks
    try {
      const response = await Promise.all(requests);
      console.log('createZaiWebhook response: ', response);
    } catch (err: any) {
      console.log('ERROR createZaiWebhook promise.all: ', err);
      throw new Error(err.message);
    }
  }

  // create bpay companies
  if (event.trigger === 'ZAI_BPAY_COMPANIES') {
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;
    // https://www.ato.gov.au/individuals-and-families/paying-the-ato/how-to-pay/other-payment-options
    const bpayCompanies = [
      // Existing Australian Tax Office (ATO) entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '51824753556',
          email: 'payment@ato.gov.au',
          name: 'Australian Tax Office (ATO)',
          legalName: 'AUSTRALIAN TAXATION OFFICE',
          address: {
            address1: 'Locked Bag 1936',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1936',
          },
          contact: {
            firstName: 'Australian Tax Office',
            lastName: 'Australian Tax Office',
            phone: '1800815886',
            email: 'payment@ato.gov.au',
          },
          firstName: 'Australian Tax Office',
          lastName: 'Australian Tax Office',
          phone: '1800815886',
          logo: null,
          billerCode: '75556',
          country: 'AUS',
        },
        company: {
          name: 'Australian Tax Office (ATO)',
          legal_name: 'AUSTRALIAN TAXATION OFFICE',
          tax_number: '51824753556',
          address: 'Locked Bag 1936, ALBURY, NSW 1936',
          phone: '1800815886',
          country: 'AUS',
        },
      },
      // New ASIC entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '86768265615',
          email: 'BN.lodgements@asic.gov.au',
          name: 'ASIC',
          legalName: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          address: {
            address1: 'Locked Bag 5000 Gippsland Mail Centre VIC 3841',
            country: 'AUS',
            state: 'VIC',
            postalCode: '3841',
          },
          contact: {
            firstName: 'ASIC',
            lastName: 'ASIC',
            phone: '1300300630',
            email: 'payment@asic.gov.au',
          },
          firstName: 'ASIC',
          lastName: 'ASIC',
          phone: '1300300630',
          logo: null,
          billerCode: '17301',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          legal_name: 'AUSTRALIAN SECURITIES AND INVESTMENTS COMMISSION',
          tax_number: '86768265615',
          address: 'Level 5, 100 Market Street, Sydney NSW 2000',
          phone: '1300300630',
          country: 'AUS',
        },
      },
      // New Waverley Council entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'COUNCIL RATES',
          taxNumber: '12502583608',
          email: 'info@waverley.nsw.gov.au',
          name: 'WAVERLEY COUNCIL',
          legalName: 'WAVERLEY COUNCIL',
          address: {
            address1: 'Locked Bag W127, Sydney, NSW, 1292',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1292',
          },
          contact: {
            firstName: 'WAVERLEY COUNCIL',
            lastName: 'WAVERLEY COUNCIL',
            phone: '(02)90838000',
            email: 'info@waverley.nsw.gov.au',
          },
          firstName: 'WAVERLEY COUNCIL',
          lastName: 'WAVERLEY COUNCIL',
          phone: '(02)90838000',
          logo: null,
          billerCode: '1610',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'WAVERLEY COUNCIL',
          legal_name: 'WAVERLEY COUNCIL',
          tax_number: '12502583608',
          address: 'Locked Bag W127, Sydney, NSW, 1292',
          phone: '(02)90838000',
          country: 'AUS',
        },
      },
      // New Optus entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TELECOMMUNICATIONS',
          taxNumber: '95088011536',
          email: 'myaccount@optus.com.au',
          name: 'Optus',
          legalName: 'Optus Billing Services Pty. Ltd',
          address: {
            address1: '1 Lyonpark Road Macquarie Park, NSW, 2113',
            country: 'AUS',
            state: 'NSW',
            postalCode: '2113',
          },
          contact: {
            firstName: 'Optus',
            lastName: 'Optus',
            phone: '1800505201',
            email: 'myaccount@optus.com.au',
          },
          firstName: 'Optus',
          lastName: 'Optus',
          phone: '1800505201',
          logo: null,
          billerCode: '959197',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'Optus',
          legal_name: 'Optus Billing Services Pty. Ltd',
          tax_number: '95088011536',
          address: '1 Lyonpark Road Macquarie Park, NSW, 2113',
          phone: '1800 505 201',
          country: 'AUS',
        },
      },
    ];

    for (let i = 0; i < bpayCompanies.length; i++) {
      const bpayCompany = bpayCompanies[i];
      const userId = randomUUID();
      const createdAt = new Date().toISOString();
      const entity = {
        ...bpayCompany.entity,
        owner: userId,
        createdAt,
        updatedAt: createdAt,
      };

      try {
        await createRecord(TABLE_ENTITY ?? '', entity);
      } catch (err: any) {
        console.log('ERROR create entity: ', err);
      }

      // create zai user
      //let zaiUser;
      //try {
      //  zaiUser = await createZaiUser(zaiAuthToken?.access_token, user);
      //} catch (err: any) {
      //  console.log('ERROR create zai user: ', err);
      //}

      //console.log('zaiUser:', zaiUser);
      //if (zaiUser) {
      //  let zaiCompany;
      //  try {
      //    zaiCompany = await createZaiCompany(
      //      zaiAuthToken?.access_token,
      //      company
      //    );
      //  } catch (err: any) {
      //    console.log('ERROR create zai company: ', err);
      //  }
      //
      //  if (zaiCompany?.companies?.id) {
      //    const entity = {
      //      ...bpayCompany.entity,
      //      zaiCompanyId: zaiCompany?.companies?.id,
      //      owner: userId,
      //    };
      //
      //    try {
      //      await createRecord(TABLE_ENTITY ?? '', entity);
      //    } catch (err: any) {
      //      console.log('ERROR create entity: ', err);
      //    }
      //  }
      //}

      //const createEntity = createRecord(TABLE_ENTITY ?? '', bpayCompany.entity);
      //const createUser = createZaiUser(zaiAuthToken?.access_token, user);
      //const createCompany = createZaiCompany(zaiAuthToken?.access_token, company);
      //requests.push(createEntity, createUser, createCompany);
    }
  }

  if (event.trigger === 'ZAI_DEMO_BPAY_COMPANIES') {
    const zaiTokenData = await initZai({
      zaiAuthToken,
      zaiClientSecret,
      zaiWebhookSecret,
    });
    zaiAuthToken = zaiTokenData.zaiAuthToken;
    zaiClientSecret = zaiTokenData.zaiClientSecret;
    zaiWebhookSecret = zaiTokenData.zaiWebhookSecret;
    // https://www.ato.gov.au/individuals-and-families/paying-the-ato/how-to-pay/other-payment-options
    const bpayCompanies = [
      // Existing Australian Tax Office (ATO) entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '51824753556',
          email: 'payment@ato.gov.au',
          name: 'ALAN TAX (DO NOT USE)',
          legalName: 'ALAN TAX',
          address: {
            address1: 'Locked Bag 1936',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1936',
          },
          contact: {
            firstName: 'ALAN TAX',
            lastName: 'ALAN TAX',
            phone: '1800815886',
            email: 'payment@ato.gov.au',
          },
          firstName: 'ALAN TAX',
          lastName: 'ALAN TAX',
          phone: '1800815886',
          logo: null,
          billerCode: '75556',
          country: 'AUS',
        },
        company: {
          name: 'ALAN TAX (DO NOT USE)',
          legal_name: 'ALAN TAX',
          tax_number: '51824753556',
          address: 'Locked Bag 1936, ALBURY, NSW 1936',
          phone: '1800815886',
          country: 'AUS',
        },
      },
      // New ASIC entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TAX',
          taxNumber: '86768265615',
          email: 'BN.lodgements@asic.gov.au',
          name: 'DYLAN TAX (DO NOT USE)',
          legalName: 'DYLAN TAX (DO NOT USE)',
          address: {
            address1: 'Locked Bag 5000 Gippsland Mail Centre VIC 3841',
            country: 'AUS',
            state: 'VIC',
            postalCode: '3841',
          },
          contact: {
            firstName: 'DYLAN TAX',
            lastName: 'DYLAN TAX',
            phone: '1300300630',
            email: 'payment@asic.gov.au',
          },
          firstName: 'DYLAN TAX',
          lastName: 'DYLAN TAX',
          phone: '1300300630',
          logo: null,
          billerCode: '17301',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'DYLAN TAX (DO NOT USE)',
          legal_name: 'DYLAN TAX (DO NOT USE)',
          tax_number: '86768265615',
          address: 'Level 5, 100 Market Street, Sydney NSW 2000',
          phone: '1300300630',
          country: 'AUS',
        },
      },
      // New Waverley Council entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'COUNCIL RATES',
          taxNumber: '12502583608',
          email: 'info@waverley.nsw.gov.au',
          name: 'ALAN NON-TAX (DO NOT USE)',
          legalName: 'ALAN NON-TAX (DO NOT USE)',
          address: {
            address1: 'Locked Bag W127, Sydney, NSW, 1292',
            country: 'AUS',
            state: 'NSW',
            postalCode: '1292',
          },
          contact: {
            firstName: 'ALAN NON-TAX',
            lastName: 'ALAN NON-TAX',
            phone: '(02)90838000',
            email: 'info@waverley.nsw.gov.au',
          },
          firstName: 'ALAN NON-TAX',
          lastName: 'ALAN NON-TAX',
          phone: '(02)90838000',
          logo: null,
          billerCode: '1610',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'ALAN NON-TAX',
          legal_name: 'ALAN NON-TAX',
          tax_number: '12502583608',
          address: 'Locked Bag W127, Sydney, NSW, 1292',
          phone: '(02)90838000',
          country: 'AUS',
        },
      },
      // New Optus entry...
      {
        entity: {
          id: randomUUID(),
          type: 'BPAY',
          subCategory: 'TELECOMMUNICATIONS',
          taxNumber: '95088011536',
          email: 'myaccount@optus.com.au',
          name: 'Optus',
          legalName: 'DYLAN NON-TAX (DO NOT USE)',
          address: {
            address1: '1 Lyonpark Road Macquarie Park, NSW, 2113',
            country: 'AUS',
            state: 'NSW',
            postalCode: '2113',
          },
          contact: {
            firstName: 'DYLAN NON-TAX',
            lastName: 'DYLAN NON-TAX',
            phone: '1800505201',
            email: 'myaccount@optus.com.au',
          },
          firstName: 'Optus',
          lastName: 'Optus',
          phone: '1800505201',
          logo: null,
          billerCode: '959197',
          country: 'AUS',
          payoutMethod: 'BPAY',
        },
        company: {
          name: 'Optus',
          legal_name: 'DYLAN NON-TAX (DO NOT USE)',
          tax_number: '95088011536',
          address: '1 Lyonpark Road Macquarie Park, NSW, 2113',
          phone: '1800 505 201',
          country: 'AUS',
        },
      },
    ];

    for (let i = 0; i < bpayCompanies.length; i++) {
      const bpayCompany = bpayCompanies[i];
      const userId = randomUUID();
      const createdAt = new Date().toISOString();
      const entity = {
        ...bpayCompany.entity,
        owner: userId,
        createdAt,
        updatedAt: createdAt,
      };

      try {
        await createRecord(TABLE_ENTITY ?? '', entity);
      } catch (err: any) {
        console.log('ERROR create entity: ', err);
      }

      // create zai user
      //let zaiUser;
      //try {
      //  zaiUser = await createZaiUser(zaiAuthToken?.access_token, user);
      //} catch (err: any) {
      //  console.log('ERROR create zai user: ', err);
      //}

      //console.log('zaiUser:', zaiUser);
      //if (zaiUser) {
      //  let zaiCompany;
      //  try {
      //    zaiCompany = await createZaiCompany(
      //      zaiAuthToken?.access_token,
      //      company
      //    );
      //  } catch (err: any) {
      //    console.log('ERROR create zai company: ', err);
      //  }
      //
      //  if (zaiCompany?.companies?.id) {
      //    const entity = {
      //      ...bpayCompany.entity,
      //      zaiCompanyId: zaiCompany?.companies?.id,
      //      owner: userId,
      //    };
      //
      //    try {
      //      await createRecord(TABLE_ENTITY ?? '', entity);
      //    } catch (err: any) {
      //      console.log('ERROR create entity: ', err);
      //    }
      //  }
      //}

      //const createEntity = createRecord(TABLE_ENTITY ?? '', bpayCompany.entity);
      //const createUser = createZaiUser(zaiAuthToken?.access_token, user);
      //const createCompany = createZaiCompany(zaiAuthToken?.access_token, company);
      //requests.push(createEntity, createUser, createCompany);
    }
  }
};
