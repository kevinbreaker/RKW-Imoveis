import { FotoImovel } from './../../shared/models/imovel/fotoImovel.model';
import { DadosImovel } from './../../shared/models/imovel/dadosImovel.model';
import { Imovel } from './../../shared/models/imovel/imovel.model';
import { AuthService } from './../../core/services/auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { StorageKeys } from './../../storagekeys';
import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MouseEvent, InfoWindowManager, AgmMap } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AnuncioService } from '../../core/services/anuncio.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/utils/snackbar.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MapsAPILoader } from '@agm/core';
import { LocalizacaoImovel } from 'src/app/shared/models/imovel/localizacaoImovel.model';
import { MatChipInputEvent } from '@angular/material';
import { CondominioImovel } from 'src/app/shared/models/imovel/condominioImovel.model';

declare var google: any;

// export interface Fruit {
//     name: string;
// }

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

interface Location {
    lat: number;
    lng: number;
    viewport?: Object;
    zoom: number;
    address_level_1?: string;
    address_level_2?: string;
    address_country?: string;
    address_zip?: string;
    address_state?: string;
    marker?: Marker;
}

@Component({
    selector: 'app-anunciar',
    templateUrl: './anunciar.component.html',
    styleUrls: ['./anunciar.component.css'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }]
})
export class AnunciarComponent implements OnInit, AfterViewInit {

    caracteristicas: any[] = [
        { caracteristica: 'Perto de vias de acesso', valor: 'Perto de vias de acesso' },
        { caracteristica: 'Próximo a shopping', valor: 'Próximo a shopping' },
        { caracteristica: 'Próximo a transporte público', valor: 'Próximo a transporte público' },
        { caracteristica: 'Próximo a escola', valor: 'Próximo a escola' },
        { caracteristica: 'Próximo a hospitais', valor: 'Próximo a hospitais' },
        { caracteristica: 'Churrasqueira', valor: 'Churrasqueira' },
        { caracteristica: 'Elevador', valor: 'Elevador' },
        { caracteristica: 'Jardim', valor: 'Jardim' },
        { caracteristica: 'Salão de festas', valor: 'Salão de festas' },
        { caracteristica: 'Playground', valor: 'Playground' },
        { caracteristica: 'Piscina', valor: 'Piscina' },
        { caracteristica: 'Piscina para adulto', valor: 'Piscina para adulto' },
        { caracteristica: 'Piscina infantil', valor: 'Piscina infantil' },
        { caracteristica: 'Salão de jogos', valor: 'Salão de jogos' },
        { caracteristica: 'Sauna', valor: 'Sauna' },
        { caracteristica: 'Gerador elétrico', valor: 'Gerador elétrico' },
        { caracteristica: 'Segurança 24h', valor: 'Segurança 24h' },
        { caracteristica: 'Interfone', valor: 'Interfone' },
        { caracteristica: 'Condomínio fechado', valor: 'Condomínio fechado' },
        { caracteristica: 'Sistema de alarme', valor: 'Sistema de alarme' },
        { caracteristica: 'Cabeamento estruturado', valor: 'Cabeamento estruturado' },
        { caracteristica: 'TV a cabo', valor: 'TV a cabo' },
        { caracteristica: 'Conexão à internet', valor: 'Conexão à internet' },
        { caracteristica: 'Garagem', valor: 'Garagem' },
        { caracteristica: 'Cozinha', valor: 'Cozinha' },
        { caracteristica: 'Área de serviço', valor: 'Área de serviço' }
    ];

    tipos = [
        {
            descricao: 'VENDA', valor: 'venda'
        },
        {
            descricao: 'ALUGUEL', valor: 'aluguel'
        }
    ];

    tipoImovel = [
        { descricao: 'Casa', valor: 'casa' },
        { descricao: 'Apartamento', valor: 'apartamento' },
        { descricao: 'KitNet', valor: 'kitnet' },
        { descricao: 'Comercial', valor: 'comercial' }
    ];

    newCaracteristica: any[] = [];

    visible = true;
    selectable = true;

    enviarImovel: Imovel = new Imovel();

    quantidades = [
        { valor: 1 },
        { valor: 2 },
        { valor: 3 },
        { valor: 4 },
        { valor: 5 },
        { valor: 6 },
        { valor: 7 },
        { valor: 8 },
        { valor: 9 },
        { valor: 10 },
        { valor: '+10' }
    ];

    geocoder: any;
    public location: Location = {
        lat: 0,
        lng: 0,
        marker: {
            lat: 0,
            lng: 0,
            draggable: true
        },
        zoom: 17
    };


    isLoading = false;

    enderecoFull: string = null;

    latitude = null;
    longitude = null;
    foto: FotoImovel = new FotoImovel();

    public zoom: number;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    @ViewChild(AgmMap) map: AgmMap;

    isLinear = false; // para disabilitar pular de etapar sem preencher o campo
    firstFormGroup;
    secondFormGroup;

    buscarEndereco;
    wc;

    localizacao: LocalizacaoImovel = new LocalizacaoImovel();
    condominioImovel: CondominioImovel = new CondominioImovel();

    imagensInput;

    dadosImovel: DadosImovel = new DadosImovel();
    fotoImovel;

    termoUso: false;
    usuarioKey: string;

    user: AngularFireAuth;

    constructor(
        private afAuth: AngularFireAuth,
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private anuncioService: AnuncioService,
        private router: Router,
        private snackbarService: SnackbarService,
        public mapsApiLoader: MapsAPILoader,
        private ngZone: NgZone
    ) {

        this.mapsApiLoader = mapsApiLoader;

        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
        });

        this.fotoImovel = [];

    }

    ngOnInit() {
        this.validaUsuario();
        this.minhaLocalizacao();
        this.user = this.afAuth;
        this.usuarioKey = this.user.auth.currentUser.uid;
        this.dadosImovel.temVaga = false;
    }

    ngAfterViewInit() {

        this.mapsApiLoader.load().then(() => {
            // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            // tslint:disable-next-line:prefer-const
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: [],
                componentRestrictions: { country: 'br' }
            });
            autocomplete.addListener('place_changed', () => {
                this.isLoading = true;
                this.ngZone.run(() => {
                    // get the place result
                    // tslint:disable-next-line:prefer-const
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        this.isLoading = false;
                        return;
                    }

                    // set latitude, longitude and zoom
                    this.location.marker.lat = place.geometry.location.lat();
                    this.location.marker.lng = place.geometry.location.lng();
                    this.location.lat = this.location.marker.lat;
                    this.location.lng = this.location.marker.lng;
                    this.zoom = 19;
                    this.enderecoFull = this.searchElementRef.nativeElement.value;
                    this.isLoading = false;
                });
            });
        });

    }

    minhaLocalizacao() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicao => {
                this.location.lat = posicao.coords.latitude;
                this.location.lng = posicao.coords.longitude;
                this.location.marker.lat = posicao.coords.latitude;
                this.location.marker.lng = posicao.coords.longitude;
                this.location.zoom = 18;
            });
        } else {
            this.location.lat = -8.059009022548944;
            this.location.lng = -34.88249920614351;
            this.location.marker.lat = null;
            this.location.marker.lng = null;
            this.location.zoom = 18;
        }
    }


    anunciar(imovel: Imovel) {

        this.anuncioService
        .sendAnuncio(imovel)
        .then((dados) => {
            console.log(dados.key);

                this.anuncioService.setAnuncioLocalizacao({
                    usuarioUid: this.usuarioKey,
                    anuncioUid: dados.key,
                    imovelLocalizacaoLatitude: this.enviarImovel.localizacao.latitude,
                    imovelLocalizacaoLongitude: this.enviarImovel.localizacao.longitude
                }).then(() =>   {
                    this.snackbarService.snackBarMessage('Anuncio publicado, veja agora seu anuncio no mapa');
                    this.router.navigate(['/imoveis']);
                });
            });
    }

    // // procura endereco digitando o texto
    updateOnMap() {
        this.isLoading = true;
        let full_address: string = this.location.address_level_1 || '';
        if (this.location.address_level_2) { full_address = full_address + ' ' + this.location.address_level_2; }
        if (this.location.address_state) { full_address = full_address + ' ' + this.location.address_state; }
        if (this.location.address_country) { full_address = full_address + ' ' + this.location.address_country; }

        this.findLocation(full_address);
    }

    findLocation(address) {
        if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
        this.geocoder.geocode({
            'address': address
        }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                // tslint:disable-next-line:no-var-keyword
                for (var i = 0; i < results[0].address_components.length; i++) {
                    // tslint:disable-next-line:prefer-const
                    let types = results[0].address_components[i].types;

                    if (types.indexOf('locality') !== -1) {
                        this.location.address_level_2 = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('country') !== -1) {
                        this.location.address_country = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('postal_code') !== -1) {
                        this.location.address_zip = results[0].address_components[i].long_name;
                    }
                    if (types.indexOf('administrative_area_level_1') !== -1) {
                        this.location.address_state = results[0].address_components[i].long_name;
                    }
                }

                if (results[0].geometry.location) {
                    this.enderecoFull = results[0].formatted_address;
                    this.location.lat = results[0].geometry.location.lat();
                    this.location.lng = results[0].geometry.location.lng();
                    this.location.marker.lat = results[0].geometry.location.lat();
                    this.location.marker.lng = results[0].geometry.location.lng();
                    this.location.marker.draggable = true;
                    this.location.viewport = results[0].geometry.viewport;
                    this.isLoading = false;
                }

                this.map.triggerResize();
            } else {
                this.snackbarService.snackBarMessage('Sorry, this search produced no results');
            }
        });
    }

    mapaClicado($event: MouseEvent) {
        this.isLoading = true;
        this.location.marker.lat = $event.coords.lat;
        this.location.marker.lng = $event.coords.lng;

        this.findAddressByCoordinates(this.location.marker.lat, this.location.marker.lng);
        console.log($event.coords.lat);
        console.log($event.coords.lng);
    }

    findAddressByCoordinates(lat, lng) {
        this.geocoder.geocode({
            'location': {
                lat: lat,
                lng: lng
            }
        }, (results, status) => {
            console.log(status);
            this.enderecoFull = results[0].formatted_address;
            console.log(results[0].formatted_address);
            console.log(this.enderecoFull);
            console.log(this.enderecoFull);
            console.log(status);

            this.isLoading = false;

        });
    }

    somaValores() {
        if (this.condominioImovel.valorCondominio || parseFloat(this.condominioImovel.valorCondominio) === 0.0) {
            this.condominioImovel.valorComCodominio =
                parseFloat(this.condominioImovel.valorCondominio + this.dadosImovel.preco).toFixed(2);
            console.log(this.condominioImovel.valorComCodominio);
        }
    }

    proximaEtapa() {
        this.localizacao.enderecoCompleto = this.enderecoFull;
        this.localizacao.rua = this.enderecoFull.split(',')[0];
        this.localizacao.numero = (this.enderecoFull.split(',')[1]).split('-')[0];

        this.localizacao.bairroCidade = (this.enderecoFull.split(',')[2]).split('-')[1] ?
            (this.enderecoFull.split(',')[1]).split('-')[1] + ' /' + (this.enderecoFull.split(',')[2]).split('-')[0] :
            (this.enderecoFull.split(',')[1]).split('-')[1];

        this.localizacao.pais = this.enderecoFull.split(',')[4] ? this.enderecoFull.split(',')[4] : this.enderecoFull.split(',')[3];
        this.localizacao.estado = (this.enderecoFull.split(',')[2]).split('-')[1] ? (this.enderecoFull.split(',')[2]).split('-')[1]
            : this.enderecoFull.split(',')[2];
        this.localizacao.cep = this.enderecoFull.split(',')[4] ? this.enderecoFull.split(',')[3] : null;
        this.localizacao.complemento = null;

        this.latitude = this.location.marker.lat;
        this.longitude = this.location.marker.lng;

        this.localizacao.latitude = this.location.marker.lat;
        this.localizacao.longitude = this.location.marker.lng;
    }

    uploadImage($event) {
        const file = $event.target.files[0];
        const fileReader = new FileReader();
        let test;
        fileReader.onloadend = () => {

            test = fileReader.result;

            this.fotoImovel.push({ url: test });
            this.dadosImovel.imgs = this.fotoImovel;
            this.imagensInput = null;
        };
        fileReader.readAsDataURL(file);

    }

    removerImg(index) {
        this.dadosImovel.imgs.splice(index, 1);
    }

    enviarAnuncio() {

        this.enviarImovel.descricaoImovel = this.dadosImovel;
        this.enviarImovel.localizacao = this.localizacao;
        this.enviarImovel.usuario = this.user.auth.currentUser.uid;
        this.anunciar(this.enviarImovel);
    }

    reseta() {
        this.termoUso = false;
    }

    validaUsuario() {
        // let usuarioStorage = localStorage.getItem(StorageKeys.AUTH_TOKEN);
        console.log(this.afAuth.auth.currentUser);
        if (this.afAuth.auth.currentUser) {
            if (localStorage.getItem(StorageKeys.AUTH_TOKEN) === this.afAuth.auth.currentUser.uid) {
                console.log('usuario Logado');
            } else {
                this.authService.logout();
                console.log('tem token mas n sao os mesmos');
                this.router.navigate(['/login']);
            }
        } else {
            console.log('não tem token');
            this.router.navigate(['/login']);
        }
    }

}
