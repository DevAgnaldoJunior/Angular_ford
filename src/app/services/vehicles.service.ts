import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Veiculo, VeiculosAPI, VehicleData } from '../models/veiculo.model';
import { API_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}

  listarVeiculos(): Observable<VeiculosAPI> {
    return this.http.get<VeiculosAPI>(`${this.apiUrl}/vehicles`);
  }

  buscarVeiculoPorId(id: string): Observable<Veiculo | undefined> {
    return this.listarVeiculos().pipe(
      map((resposta) => {
        return resposta.vehicles.find((veiculo) => String(veiculo.id) === String(id));
      })
    );
  }

  buscarDadosVeiculo(codigoVeiculo: string): Observable<VehicleData> {
    return this.http.post<VehicleData>(`${this.apiUrl}/vehicleData`, {
      vin: codigoVeiculo
    });
  }
}