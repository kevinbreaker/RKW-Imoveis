import { AnunciarComponent } from './anunciar/anunciar.component';
import { LoginComponent } from './login/login.component';
import { PlanosComponent } from './planos/planos.component';
import { PrincipalComponent } from './principal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImoveisComponent } from './imoveis/imoveis.component';

const routes: Routes = [
    {
        path: '',
        component: PrincipalComponent,
        children: [
            {
                path: 'imoveis',
                component: ImoveisComponent
            },
            {
                path: 'anunciar',
                component: AnunciarComponent
            },
            {
                path: 'planos',
                component: PlanosComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {path: '**', redirectTo: 'anunciar'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrincipalRoutingModule { }
