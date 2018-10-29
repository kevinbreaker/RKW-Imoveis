import { AuthService } from './../../core/services/auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { StorageKeys } from './../../storagekeys';
import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MouseEvent, InfoWindowManager, AgmMap } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AnuncioService } from '../../core/services/anuncio.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/utils/snackbar.service';


import { MapsAPILoader } from '@agm/core';

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

    suaLatitude = null;
    suaLogintude = null;

    latitude = null;
    longitude = null;
    coord = {};

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
            dadosImovel: ['', Validators.required]
        });
        this.validaUsuario();
        this.teste();



    }

    ngAfterViewInit() {
        this.mapsAPILoader.load().then(() => {
            // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                // tslint:disable-next-line:prefer-const
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: [],
                componentRestrictions: {country: 'br'}
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    // tslint:disable-next-line:prefer-const
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    // set latitude, longitude and zoom
                    this.location.marker.lat = place.geometry.location.lat();
                    this.location.marker.lng = place.geometry.location.lng();
                    this.location.lat = this.location.marker.lat;
                    this.location.lng = this.location.marker.lng;
                    this.zoom = 19;
                });
            });
        });
    }


    mapaClicado($event: MouseEvent) {
        this.location.marker.lat = $event.coords.lat;
        this.location.marker.lng = $event.coords.lng;
        // this.coord = {
        //     latitude: this.latitude,
        //     longitude: this.longitude
        // };
        this.findAddressByCoordinates(this.location.marker.lat, this.location.marker.lng);
        console.log($event.coords.lat);
        console.log($event.coords.lng);
    }

    teste() {
        // const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicao => {
                this.location.lat = posicao.coords.latitude;
                this.location.lng = posicao.coords.longitude;
                this.location.marker.lat = posicao.coords.latitude;
                this.location.marker.lng = posicao.coords.longitude;
                this.location.zoom = 18;
            });
        } else {
            this.latitude = -8.059009022548944;
            this.longitude = -34.88249920614351;
            this.suaLatitude = null;
            this.suaLogintude = null;
            this.zoom = 18;
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
            console.log(results);
            console.log(status);
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
                }

                this.map.triggerResize();
            } else {
                alert('Sorry, this search produced no results.');
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
            console.log(results);
            this.decomposeAddressComponents(results);
        });
    }

    decomposeAddressComponents(addressArray) {
        if (addressArray.length === 0) { return false; }
        // tslint:disable-next-line:prefer-const
        let address = addressArray[0].address_components;
        this.enderecoFull = addressArray[0].formatted_address;

        // this.location.address_level_1 = this.enderecoFull;
        // tslint:disable-next-line:prefer-const
        for (let element of address) {
            if (element.length === 0 && !element['types']) { continue; }

            if (element['types'].indexOf('street_number') > -1) {
                this.location.address_level_1 = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('route') > -1) {
                this.location.address_level_1 += ', ' + element['long_name'];
                continue;
            }
            if (element['types'].indexOf('locality') > -1) {
                this.location.address_level_2 = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('administrative_area_level_1') > -1) {
                this.location.address_state = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('country') > -1) {
                this.location.address_country = element['long_name'];
                continue;
            }
            if (element['types'].indexOf('postal_code') > -1) {
                this.location.address_zip = element['long_name'];
                continue;
            }
        }
    }

}
