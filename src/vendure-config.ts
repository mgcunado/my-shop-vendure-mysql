import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  // DefaultSearchPlugin,
  VendureConfig,
  EntityHydrator,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { compileUiExtensions, setBranding } from '@vendure/ui-devkit/compiler';

import 'dotenv/config';
import path from 'path';
import { ProvincePlugin } from './plugins/province/province.plugin';
import { ElasticSearchInput, ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';
import { StripePlugin } from '@vendure/payments-plugin/package/stripe';

const IS_DEV = process.env.APP_ENV === 'dev';

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV ? {
      adminApiPlayground: {
        settings: { 'request.credentials': 'include' },
      },
      adminApiDebug: true,
      shopApiPlayground: {
        settings: { 'request.credentials': 'include' },
      },
      shopApiDebug: true,
    } : {}),
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    type: 'mariadb',
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
    logging: false,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    StripePlugin.init({
      // This prevents different customers from using the same PaymentIntent
      storeCustomersInStripe: true,
      // paymentIntentCreateParams: (injector, ctx, order) => {
      //   let metadata = {};
      //   if (order.customer?.firstName) {
      //     metadata = {
      //       name: order.customer.firstName,
      //     };
      //   }
      //
      //   return {
      //     payment_method: 'pm_card_visa', 
      //     metadata,
      //   };
      // },
    }),
    ProvincePlugin.init(),
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : 'https://www.my-shop.com/assets',
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    // DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    ElasticsearchPlugin.init({
      host: 'http://localhost',
      port: 9200,
      searchConfig: {
        mapQuery: (query: any, input: ElasticSearchInput, searchConfig: any) => {
          query.bool.must = [
            {
              query_string: {
                query: "*" + input.term + "*",
                fields: [
                  `productName^${searchConfig.boostFields.productName}`,
                  `description^${searchConfig.boostFields.description}`,
                ],
              }
            }
          ];

          return query;
        }
      },
      // we use asciifolding filter to not discriminate by accents
      indexSettings: {
        analysis: {
          analyzer: {
            custom_analyzer: {
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding']
            }
          }
        }
      },
      indexMappingProperties: {
        productName: {
          type: 'text',
          analyzer: 'custom_analyzer',
        },
        description: {
          type: 'text',
          analyzer: 'custom_analyzer',
        },
      }
    }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation.
        // Here we are assuming a storefront running at http://localhost:8080.
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: 'http://localhost:8080/verify',
        passwordResetUrl: 'http://localhost:8080/password-reset',
        changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
      },
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
      app: compileUiExtensions({
        outputPath: path.join(__dirname, '../admin-ui'),
        extensions: [
          {
            id: 'test-extension',
            extensionPath: path.join(__dirname, 'plugins/my-plugin/ui'),
            providers: ['providers.ts'],
            staticAssets: [
              path.join(__dirname, 'images'),
            ]
          },
          setBranding({
            // The small logo appears in the top left of the screen
            smallLogoPath: path.join(__dirname, 'images/my-logo-sm-transparent.png'),
            // The large logo is used on the login page
            largeLogoPath: path.join(__dirname, 'images/my-logo-lg-transparent.png'),
            faviconPath: path.join(__dirname, 'images/my-favicon.ico'),
          }),

        ],
        devMode: true,
      }),
      adminUiConfig: {
        apiPort: 3000,
        loginImageUrl: '/admin/assets/images/leopard.jpg',
      },
    }),
  ],
};
