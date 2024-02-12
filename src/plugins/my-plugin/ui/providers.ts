import { addActionBarItem } from '@vendure/admin-ui/core';
import { registerCustomDetailComponent } from '@vendure/admin-ui/core';
import { MyCustomComponent } from './components/my-custom/my-custom.component';

export default [
    addActionBarItem({
        id: 'test-button',
        label: 'Test Button',
        locationId: 'order-list',
    }),

  registerCustomDetailComponent({
    locationId: 'product-detail',
    component: MyCustomComponent,
  }),
];
