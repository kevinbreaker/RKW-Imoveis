import { PrincipalModule } from './../../../principal/principal.module';
import { SnackbarService } from './../../../shared/utils/snackbar.service';
import { StorageKeys } from './../../../storagekeys';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<firebase.User>;
    dataBaseFirebase: AngularFireDatabase;

    emailUsuario: string;
    uidUsuario: string;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private snackBarService: SnackbarService,
        private firebaseDb: AngularFireDatabase
    ) {
        this.user = afAuth.authState;
        this.dataBaseFirebase = firebaseDb;
    }

    signIn(auth: { email: string, password: string }) {
        return this.afAuth.auth.signInWithEmailAndPassword(auth.email, auth.password)
            .then((user) => {
                console.log(user.user);
                localStorage.setItem(StorageKeys.AUTH_TOKEN, user.user.uid);
                this.router.navigate(['/anunciar']);
            }).catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    this.snackBarService.snackBarError('Endereço de email não existe');
                } else if (error.code === 'auth/wrong-password') {
                    this.snackBarService.snackBarError('Email ou senha incorretos!');
                } else if (error.code === 'auth/user-disabled') {
                    this.snackBarService.snackBarError('Este usuário foi desabilitado');
                } else if (error.code === 'auth/invalid-email') {
                    this.snackBarService.snackBarError('Este endereço de email não é válido');
                }
                this.router.navigate(['/login']);
            });
    }

    signUp(auth: { nome: string, email: string, password: string, nivelPermissao: string }) {
        const criadoEm = new Date();
        return this.afAuth.auth.createUserWithEmailAndPassword(auth.email, auth.password)
            .then((data) => {
                console.log(data);
                this.dataBaseFirebase.object('usuarios/' + data.user.uid).set({
                    nome: auth.nome,
                    email: data.user.email,
                    usuarioUid: data.user.uid,
                    createdAt: criadoEm.toDateString(),

                });
                localStorage.setItem(StorageKeys.AUTH_TOKEN, data.user.uid);
                this.router.navigate(['/anunciar']);
            }).catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    this.snackBarService.snackBarError('Este endereço de email já está em uso');
                } else if (error.code === 'auth/weak-password') {
                    this.snackBarService.snackBarError('Senha está fraca!');
                } else if (error.code === 'auth/operation-not-allowed') {
                    this.snackBarService.snackBarError('Atualmente não é possivel criar um novo usuario');
                } else if (error.code === 'auth/invalid-email') {
                    this.snackBarService.snackBarError('Este endereço de email não é válido');
                }
            });
    }

    logout() {
        this.afAuth.auth.signOut()
            .then(() => {
                localStorage.removeItem(StorageKeys.AUTH_TOKEN);
                this.router.navigate(['/login']);
            });
    }

    // usuarioAutenticado() {
    //     return firebase.auth();
    // }



}
