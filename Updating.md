# my-shop-vendure-mysql

## Extending shop-api

### Adding a new query: provinceByCode()

- in `src/plugins/province/api/api-extensions.ts`:
```
import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  extend type Query {
    "Get an array by code"
    provinceByCode(countryId: ID!, code: String!): Province!
  }
`;
```

- in `src/plugins/province/api/province-shop.resolver.ts`:
```
@Resolver()
export class ProvinceShopResolver {
    constructor(private provinceService: ProvinceService) {}

    @Query()
    async provinceByCode(
        @Ctx() ctx: RequestContext,
        @Args() args: { countryId: ID, code: string, queryProvincesArgs: QueryProvincesArgs },
    ): Promise<Translated<Province>> {
        return await this.provinceService.findOneByCode(ctx, args.countryId, args.code);
    }
}
```

- in `src/plugins/province/services/province.service.ts`:
```
@Injectable()
export class ProvinceService {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  async findOneByCode(ctx: RequestContext, countryId: ID, code: string): Promise<Translated<Province>> {
      return await this.connection
          .getRepository(ctx, Province)
          .findOne({ where: { parentId: countryId, code } })
          .then(province => this.translator.translate(province!, ctx));

  }
}
```

- finally in project root stop the server by <ctr-c> twice and restart by `yarn dev`.

- we can see the new query on `http://localhost:3000/shop-api` using:
```
query {
  provinceByCode(countryId: "209", code: "GIP") {
    id
    name
  }
}
```

### On angular storefront

- we can extend generated types by adding new types to use after on storefront on:
```
src/app/common/graphql/documents.graphql.ts
src/app/common/graphql/fragments.graphql.ts
```

- we add related type on `src/app/common/graphql/documents.graphql.ts`:
```
export const GET_PROVINCE_BY_CODE = gql`
    query GetProvinceByCode(countryId: ID!, code: String!) {
        provinceByCode(countryId: $countryId, code: $code) {
            ...Province
        }
    }
    ${PROVINCE_FRAGMENT}
`;
```

- the config file is at:
```
codegen.yml
```

- regenerated types by next script command on project root:
```
yarn generate-types
```
- finally restart storefront:
```
yarn start
```

