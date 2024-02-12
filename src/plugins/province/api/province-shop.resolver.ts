import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, ID, RequestContext, Translated } from '@vendure/core';

import { QueryProvincesArgs } from '@vendure/common/lib/generated-types';
import { Province } from '@vendure/core/dist/entity/region/province.entity';
import { ProvinceService } from '../services/province.service';

@Resolver()
export class ProvinceShopResolver {
    constructor(private provinceService: ProvinceService) {}

    @Query()
    async availableProvinces(
        @Ctx() ctx: RequestContext,
        @Args() args: { countryId: ID, queryProvincesArgs: QueryProvincesArgs },
    ): Promise<Array<Translated<Province>>> {
        return await this.provinceService.findAllByCountryId(ctx, args.countryId);
    }

    @Query()
    async provinceByCode(
        @Ctx() ctx: RequestContext,
        @Args() args: { countryId: ID, code: string, queryProvincesArgs: QueryProvincesArgs },
    ): Promise<Translated<Province>> {
        return await this.provinceService.findOneByCode(ctx, args.countryId, args.code);
    }
}
