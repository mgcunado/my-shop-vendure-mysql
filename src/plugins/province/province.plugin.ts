import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { shopApiExtensions } from './api/api-extensions';
import { ProvinceService } from './services/province.service';
import { ProvinceShopResolver } from './api/province-shop.resolver';

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ProvinceShopResolver],
  },
  providers: [ProvinceService],
})
export class ProvincePlugin {
  static init() {
    return ProvincePlugin;
  }
}
