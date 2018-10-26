import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AnuncioService {

    constructor(
        private firebaseDb: AngularFireDatabase
    ) { }

    sendAnuncio(coord, nome, endereco) {
        return this.firebaseDb.database.ref('anuncios').push({
                cooordenadas: coord,
                nome: nome,
                endereco: endereco
        });
    }

    getAllAnuncios() {
        return this.firebaseDb.list('anuncios').valueChanges();
    }
}
