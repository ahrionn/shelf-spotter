import { NgModule } from '@angular/core';

import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatDialogModule,
    ],
    exports: [
        MatDialogModule,
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, direction: 'ltr' } }
    ]
})
export class MaterialModule { }