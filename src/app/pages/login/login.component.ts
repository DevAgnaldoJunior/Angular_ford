import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  nome: string = '';
  senha: string = '';
  mensagemErro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      this.router.navigate(['/dashboard']);
    }
  }

  entrar(): void {
    if (!this.nome || !this.senha) {
      this.mensagemErro = 'Preencha nome e senha.';
      return;
    }

    this.authService.login(this.nome, this.senha).subscribe({
      next: (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/dashboard']);
      },
      error: (erro) => {
        console.error('Erro no login:', erro);
        this.mensagemErro = 'Usuário ou senha inválidos.';
      }
    });
  }
}