import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
} from '@angular/material';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatProgressSpinnerModule,
        TextFieldModule,
    ],
    exports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatProgressSpinnerModule,
        TextFieldModule,
    ]
})
export class MainMaterialModule {}
