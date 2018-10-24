import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule,
    ],
    exports: [
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatPaginatorModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDialogModule,
        MatButtonModule,
    ]
})
export class MainMaterialModule {}
