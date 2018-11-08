import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Imovel } from 'src/app/shared/models/imovel/imovel.model';


@Injectable({
    providedIn: 'root'
})
export class AnuncioService {

    constructor(
        private firebaseDb: AngularFireDatabase
    ) { }

    sendAnuncio(imovel: Imovel) {
        return this.firebaseDb.database.ref('anuncios').push({
                imovel: imovel
        });
    }

    getAllAnuncios() {
        return this.firebaseDb.list('anuncios').valueChanges();
    }
}
