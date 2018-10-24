import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MouseEvent, InfoWindowManager } from '@agm/core';
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

    constructor(
        private _formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });

        this.teste();
    }

    mapaClicado($event: MouseEvent) {
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        console.log($event.coords.lat);
        console.log($event.coords.lng);
    }

    teste() {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((posicao) =>  {
                this.latitude = posicao.coords.latitude;
                this.longitude = posicao.coords.longitude;
                this.suaLatitude = posicao.coords.latitude;
                this.suaLogintude = posicao.coords.longitude;
            });

        }
    }

}
