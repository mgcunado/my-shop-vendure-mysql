import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  extend type Query {
    "An array of supported Provinces by CountryId"
    availableProvinces(countryId: ID!): [Province!]!

    "Get a province by code"
    provinceByCode(countryId: ID!, code: String!): Province!
  }

  extend type Address {
    province2: Province
  }

  # extend type OrderAddress {
  #   province2: String
  # }
`;
