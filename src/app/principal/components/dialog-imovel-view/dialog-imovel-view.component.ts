import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImovelDialog } from '../../../shared/imovel/imovel-dialog.interface';
import { Imovel } from 'src/app/shared/models/imovel/imovel.model';

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
        @Inject(MAT_DIALOG_DATA) public imovel
    ) { }

    ngOnInit() {
        console.log(this.imovel);
        // this.imagens = this.imovel.imgs;
    }
}
