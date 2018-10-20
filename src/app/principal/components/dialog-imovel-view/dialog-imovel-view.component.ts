import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImovelDialog } from '../../../shared/imovel/imovel-dialog.interface';

@Component({
    selector: 'app-dialog-imovel-view',
    templateUrl: './dialog-imovel-view.component.html',
    styleUrls: ['./dialog-imovel-view.component.css']
})
export class DialogImovelViewComponent implements OnInit {

    imagens = [];
    slides = [];

    constructor(
        // public dialogRef: MatDialogRef<DialogImovelViewComponent>,
        @Inject(MAT_DIALOG_DATA) public imovel: ImovelDialog
    ) { }

    ngOnInit() {
        console.log(this.imovel);
        this.imagens = this.imovel.dadosDoImovel.imgs;
    }
}
