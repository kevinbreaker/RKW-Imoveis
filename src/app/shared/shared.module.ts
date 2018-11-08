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
    MAT_CHECKBOX_CLICK_ACTION,
    MatChipsModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: 'right',
    allowNegative: true,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: '',
    thousands: '.'
};

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
        CurrencyMaskModule,
        SlickCarouselModule,
        MatChipsModule
    ],
    providers: [
        // {provide: MatStepperIntl, useClass: MyIntl},
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'},
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    declarations: []
})
export class SharedModule { }
