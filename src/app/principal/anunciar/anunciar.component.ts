import { AuthService } from './../../core/services/auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { StorageKeys } from './../../storagekeys';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MouseEvent, InfoWindowManager } from '@agm/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AnuncioService } from '../../core/services/anuncio.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-anunciar',
    templateUrl: './anunciar.component.html',
    styleUrls: ['./anunciar.component.css'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
      }]
})
export class AnunciarComponent implements OnInit {

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    suaLatitude = null;
    suaLogintude = null;

    latitude = null;
    longitude = null;
    coord = {};

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private afAuth: AngularFireAuth,
        private authService: AuthService,
        private anuncioService: AnuncioService
    ) { }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            nome: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            endereco: ['', Validators.required]
        });
        this.validaUsuario();
    }

    mapaClicado($event: MouseEvent) {
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.coord = {
            latitude: this.latitude,
            longitude: this.longitude
        };
        console.log($event.coords.lat);
        console.log($event.coords.lng);
    }

    teste() {
        const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicao => {
                this.latitude = posicao.coords.latitude;
                this.longitude = posicao.coords.longitude;
                this.suaLatitude = posicao.coords.latitude;
                this.suaLogintude = posicao.coords.longitude;
            });
        } else {
            this.latitude = -8.059009022548944;
            this.longitude = -34.88249920614351;
            this.suaLatitude = null;
            this.suaLogintude = null;
        }
    }

    anunciar() {
        // this.enviarAnuncio().then(() => {
        //     console.log('enviou');
        // });
        this.anuncioService.sendAnuncio(this.coord, this.firstFormGroup.value, this.secondFormGroup.value).then(() =>   {
            alert('enviouuu!');
        });
    }

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
        // let usuarioStorage = localStorage.getItem(StorageKeys.AUTH_TOKEN);
        console.log(this.afAuth.auth.currentUser);
        if (this.afAuth.auth.currentUser) {
            if (localStorage.getItem(StorageKeys.AUTH_TOKEN) === this.afAuth.auth.currentUser.uid) {
                console.log('usuario Logado');
                this.teste();
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
