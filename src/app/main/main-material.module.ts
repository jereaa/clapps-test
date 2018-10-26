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
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
} from '@angular/material';
import { TextFieldModule } from '@angular/cdk/text-field';

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
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        TextFieldModule,
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
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        TextFieldModule,
    ]
})
export class MainMaterialModule {}
