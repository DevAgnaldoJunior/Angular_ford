import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario.model';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}

  login(nome: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, {
      nome,
      senha
    });
  }
}