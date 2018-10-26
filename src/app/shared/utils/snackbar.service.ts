import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(
        private snackBar: MatSnackBar
    ) { }

    snackBarError(messagem: string, error?: any) {
        this.snackBar.open(
            messagem,
            'OK', {
                duration: 5000,
                verticalPosition: 'top'
            }
        );
    }

    snackBarMessage(messagem: string) {
        this.snackBar.open(
            messagem,
            'OK', {
                duration: 3000,
                verticalPosition: 'top'
            }
        );
    }
}