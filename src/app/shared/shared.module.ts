import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatStepperModule,
    MatStepperIntl,
    MatSelectModule,
    MAT_CHECKBOX_CLICK_ACTION
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
        MatRadioModule,
        MatSidenavModule,
        MatSelectModule,
        MatStepperModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatToolbarModule,
        ReactiveFormsModule,
        SlickCarouselModule
    ],
    providers: [
        // {provide: MatStepperIntl, useClass: MyIntl},
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
    ],
    declarations: []
})
export class SharedModule { }
