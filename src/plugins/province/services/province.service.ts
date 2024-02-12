import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { RequestContext, TransactionalConnection, Translated, TranslatorService } from '@vendure/core';
import { Province } from '@vendure/core/dist/entity/region/province.entity';

/**
 * @description
 * Contains methods relating to {@link Province} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class ProvinceService {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  async findAllByCountryId(ctx: RequestContext, countryId: ID): Promise<Array<Translated<Province>>> {
    return await this.connection
      .getRepository(ctx, Province)
      .find({ where: { parentId: countryId } })
      .then(items => items.map(province => this.translator.translate(province, ctx)));
  }

  async findOneByCode(ctx: RequestContext, countryId: ID, code: string): Promise<Translated<Province>> {
      return await this.connection
          .getRepository(ctx, Province)
          .findOne({ where: { parentId: countryId, code } })
          .then(province => this.translator.translate(province!, ctx));

  }
}

