import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CustomDetailComponent, SharedModule } from '@vendure/admin-ui/core';

@Component({
    template: `
        <vdr-card title="CMS Info">
            <pre>How are you, are you ok?</pre>
        </vdr-card>`,
    standalone: true,
    providers: [],
    imports: [SharedModule],
})
export class MyCustomComponent implements CustomDetailComponent {
    // These two properties are provided by Vendure and will vary
    // depending on the particular detail page you are embedding this
    // component into. In this case, it will be a "product" entity.
    entity$: Observable<any>
    detailForm: FormGroup;

    extraInfo$: Observable<any>;

    constructor() { }

}
