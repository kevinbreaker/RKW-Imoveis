import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { StorageKeys } from 'src/app/storagekeys';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginFormulario: FormGroup;

    configuracao = {
        isLogin: true,
        actionText: 'Login',
        buttonActionText: 'Cadastrar novo usuario',
        isLoading: false
    };

    private nomeControler = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]);

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private afAuth: AngularFireAuth,
        private router: Router
    ) { }

    ngOnInit() {
        this.createFormLogin();
    }

    createFormLogin() {
        this.loginFormulario = this.formBuilder.group({
            email: [
                '',
                [
                    Validators.email,
                    Validators.required,
                    Validators.maxLength(50)
                ]
            ],
            password: [
                '',
                [
                    Validators.minLength(6),
                    Validators.required,
                    Validators.maxLength(24)
                ]
            ]
        });
    }

    changeAction(): void {
        // this.router.navigate(['signup']);
        this.configuracao.isLogin = !this.configuracao.isLogin;
        this.configuracao.actionText = !this.configuracao.isLogin ? 'Cadastrar' : 'Login';
        this.configuracao.buttonActionText = !this.configuracao.isLogin ? 'Já tenho uma conta' : 'Cadastrar novo usuario';
        if (!this.configuracao.isLogin) {
            this.loginFormulario.addControl('nome', this.nomeControler);
        } else {
            this.loginFormulario.removeControl('nome');
        }
    }

    get nome(): FormControl {
        return <FormControl>this.loginFormulario.get('nome');
    }

    get email(): FormControl {
        return <FormControl>this.loginFormulario.get('email');
    }

    get password(): FormControl {
        return <FormControl>this.loginFormulario.get('password');
    }

    onSubmit() {
        this.configuracao.isLoading = true;
        if (this.configuracao.isLogin) {
            this.authService.signIn(this.loginFormulario.value).then(() => {
                this.configuracao.isLoading = false;
            });
        } else {
            this.authService.signUp(this.loginFormulario.value).then(() => {
                this.configuracao.isLoading = false;
            });
        }
    }



}
