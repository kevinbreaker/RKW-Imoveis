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


import { MapsAPILoader } from '@agm/core';
import { LocalizacaoImovel } from 'src/app/shared/models/imovel/localizacaoImovel.model';

declare var google: any;


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


    tipos = [
        {
            descricao: 'VENDA', valor: 'venda'
        },
        {
            descricao: 'ALUGUEL', valor: 'aluguel'
        }
    ];

    tipoImovel = [
        { descricao: 'Casa', valor: 'casa'},
        { descricao: 'Apartamento', valor: 'apartamento'},
        { descricao: 'KitNet', valor: 'kitnet'},
        { descricao: 'Comercial', valor: 'comercial'}
    ];

    quantidades = [
        { valor: 1},
        { valor: 2},
        { valor: 3},
        { valor: 4},
        { valor: 5},
        { valor: 6},
        { valor: 7},
        { valor: 8},
        { valor: 9},
        { valor: 10},
        { valor: '+10'}
    ];

    localizacaoImovel: LocalizacaoImovel;

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

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    testeGroup: FormGroup;

    latitude = null;
    longitude = null;

    // condominio;

    isLoading = false;

    enderecoFull: string = null;

    public searchControl: FormControl;
    public zoom: number;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    @ViewChild(AgmMap) map: AgmMap;

    constructor(
        private _formBuilder: FormBuilder,
        private snackbarService: SnackbarService,
        private router: Router,
        private afAuth: AngularFireAuth,
        private authService: AuthService,
        private anuncioService: AnuncioService,
        private mapsAPILoader: MapsAPILoader,
        public mapsApiLoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
        this.mapsApiLoader = mapsApiLoader;

        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
        });

    }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            localizacao: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            enderecoCompleto: [{ value: '', disabled: true }, Validators.required],
            rua: [{ value: '', disabled: true }, Validators.required],
            bairroCidade: [{ value: '', disabled: true }, Validators.required],
            numero: ['', Validators.required],
            complemento: [''],
            pais: [{ value: '', disabled: true }, Validators.required],
            cep: [{ value: '', disabled: true }, Validators.required],
            estado: [{ value: '', disabled: true }, Validators.required],

            condominio: false,
            valorCondominio: [''],
            vaga: false,
            iptu: false,
            imagens: this._formBuilder.array([this.createImage()])
            // imagens: ''
        });
        // this.validaUsuario();
        this.teste();

    }

    get condominio(): FormControl {
        return <FormControl>this.secondFormGroup.get('condominio');
    }
    get iptu(): FormControl {
        return <FormControl>this.secondFormGroup.get('iptu');
    }
    get vaga(): FormControl {
        return <FormControl>this.secondFormGroup.get('vaga');
    }

    get imagens(): FormControl {
        return <FormControl>this.secondFormGroup.get('imagens');
    }

    createImage() {
        return this.testeGroup = this._formBuilder.group({
            img: '',
            descricao: ''
        });
    }

    ngAfterViewInit() {
        this.mapsAPILoader.load().then(() => {
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

    uploadImage($event) {
        const file = $event.target.files[0];
        const fileReader = new FileReader();

        // tslint:disable-next-line:prefer-const
        let item: FormArray;
        item = this.secondFormGroup.get('imagens') as FormArray;
        fileReader.onloadend = () =>    {
            this.testeGroup.patchValue({
                img: fileReader.result
            });
            item.push(this.createImage());
        };
        fileReader.readAsDataURL(file);
        // fileReader.onloadend = () =>    {
        //     this.secondFormGroup.patchValue({
        //         imagens: fileReader.result
        //     });
        // };
        // fileReader.readAsDataURL(file);
        // console.log
        console.log(this.imagens.value);
    }

    proximaEtapa() {
        this.secondFormGroup.setValue({
            enderecoCompleto: this.enderecoFull,
            rua: this.enderecoFull.split(',')[0],
            numero: (this.enderecoFull.split(',')[1]).split('-')[0],
            bairroCidade: (this.enderecoFull.split(',')[2]).split('-')[1] ?
                (this.enderecoFull.split(',')[1]).split('-')[1] + ' /' + (this.enderecoFull.split(',')[2]).split('-')[0] :
                (this.enderecoFull.split(',')[1]).split('-')[1],
            pais: this.enderecoFull.split(',')[4] ? this.enderecoFull.split(',')[4] : this.enderecoFull.split(',')[3],
            estado: (this.enderecoFull.split(',')[2]).split('-')[1] ? (this.enderecoFull.split(',')[2]).split('-')[1]
                : this.enderecoFull.split(',')[2],
            cep: this.enderecoFull.split(',')[4] ? this.enderecoFull.split(',')[3] : null,
            complemento: null
        });
        this.latitude = this.location.marker.lat;
        this.longitude = this.location.marker.lng;
    }

    get enderecoCompleto(): FormControl {
        return <FormControl>this.secondFormGroup.get('enderecoCompleto');
    }

    resetValues() {
        this.secondFormGroup.setValue({
            enderecoCompleto: '',
            rua: '',
            numero: '',
            bairroCidade: '',
            pais: '',
            estado: '',
            cep: '',
            complemento: null
        });
        this.latitude = null;
        this.longitude = null;
    }

    mapaClicado($event: MouseEvent) {
        this.isLoading = true;
        this.location.marker.lat = $event.coords.lat;
        this.location.marker.lng = $event.coords.lng;

        this.findAddressByCoordinates(this.location.marker.lat, this.location.marker.lng);
        console.log($event.coords.lat);
        console.log($event.coords.lng);
    }

    teste() {
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

    // anunciar() {

    //     this.anuncioService
    //         .sendAnuncio(this.coord, this.firstFormGroup.value, this.secondFormGroup.value)
    //         .then(() => {
    //             this.snackbarService.snackBarMessage('Anuncio publicado, veja agora seu anuncio no mapa');
    //             this.router.navigate(['/imoveis']);
    //         });
    // }

    // enviarAnuncio() {
    //     return new Promise((resolve, reject) =>   {
    //         this.db.list('anuncios')
    //                 .push({
    //                     coordenadas: this.coord,
    //                     nome: this.firstFormGroup.value,
    //                     endereco: this.secondFormGroup.value
    //                 })
    //                 .then(() => {
    //                     resolve();
    //                     alert('enviou');
    //                 });
    //     })
    // }

    validaUsuario() {
        console.log(this.afAuth.auth.currentUser);
        if (this.afAuth.auth.currentUser) {
            if (localStorage.getItem(StorageKeys.AUTH_TOKEN) === this.afAuth.auth.currentUser.uid) {
                console.log('usuario Logado');
                // this.teste();
            } else {
                localStorage.removeItem(StorageKeys.AUTH_TOKEN);
                this.authService.logout();
                console.log('tem token mas n sao os mesmos');
                this.router.navigate(['/login']);
            }
        } else {
            console.log('não tem token');
            this.router.navigate(['/login']);
        }
    }
    // procura endereco digitando o texto
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


    findAddressByCoordinates(lat, lng) {
        this.geocoder.geocode({
            'location': {
                lat: lat,
                lng: lng
            }
        }, (results, status) => {
            console.log(results[0].formatted_address);
            console.log(this.enderecoFull);
            this.enderecoFull = results[0].formatted_address;
            console.log(this.enderecoFull);
            if (this.enderecoFull === results[0].formatted_address) {
                this.isLoading = false;
            }
        });
    }

}
