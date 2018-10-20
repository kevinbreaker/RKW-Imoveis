import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

    menu: any[] = [
        { title: 'Home', icone: 'home', rota: '' },
        { title: 'Imovéis', icone: 'location_city', rota: '/imoveis' },
        { title: 'Planos', icone: 'attach_money', rota: '/planos' },
        { title: 'Entrar', icone: 'person', rota: '/login' },
        { title: 'Novo Usuário', icone: 'person_add', rota: '/signup' },
    ];

    constructor() { }

    ngOnInit() {
    }

}
