import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Imovel } from 'src/app/shared/models/imovel/imovel.model';
import { LocalizacaoImovel } from 'src/app/shared/models/imovel/localizacaoImovel.model';
import { ImovelLocalizacao } from 'src/app/shared/models/imovel/imovelLocalizacao.model';


@Injectable({
    providedIn: 'root'
})
export class AnuncioService {

    constructor(
        private firebaseDb: AngularFireDatabase
    ) { }

    sendAnuncio(imovel: Imovel) {
        return this.firebaseDb.database.ref('anuncios').push({
                descricaoImovel: imovel.descricaoImovel,
                localizacao: imovel.localizacao,
                usuario: imovel.usuario
        });
    }

    setAnuncioLocalizacao(localizacao: ImovelLocalizacao) {
        return this.firebaseDb.database.ref('imoveisLocalizacoes').push({
            usuarioUid: localizacao.usuarioUid,
            anuncioUid: localizacao.anuncioUid,
            imovelLocalizacaoLatitude: localizacao.imovelLocalizacaoLatitude,
            imovelLocalizacaoLongitude: localizacao.imovelLocalizacaoLongitude
        });
    }

    getAllAnuncios() {
        return this.firebaseDb.list('imoveisLocalizacoes').valueChanges();
    }

    getAnuncioId(anuncioUid) {
        return this.firebaseDb.object('anuncios/' + anuncioUid).valueChanges();
    }
}
