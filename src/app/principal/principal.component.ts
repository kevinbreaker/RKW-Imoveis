import { AuthService } from './../core/services/auth/auth.service';
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
        { title: 'Anunciar', icone: 'add_circle', rota: '/anunciar' },
        { title: 'Entrar', icone: 'person', rota: '/login' }
    ];

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
    }

    logout() {
        this.authService.logout();
    }

}
