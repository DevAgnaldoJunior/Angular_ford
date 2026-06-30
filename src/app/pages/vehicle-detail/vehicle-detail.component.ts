import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VehiclesService } from '../../services/vehicles.service';
import { Veiculo } from '../../models/veiculo.model';

@Component({
  selector: 'app-vehicle-detail',
  imports: [CommonModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent implements OnInit {
  veiculo: Veiculo | undefined;

  carregando = true;
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesService: VehiclesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.mensagemErro = 'Veículo não encontrado.';
      this.carregando = false;
      return;
    }

    this.buscarVeiculo(id);
  }

  buscarVeiculo(id: string): void {
    this.vehiclesService.buscarVeiculoPorId(id).subscribe({
      next: (veiculo) => {
        if (!veiculo) {
          this.mensagemErro = 'Veículo não encontrado.';
          this.carregando = false;
          return;
        }

        this.veiculo = veiculo;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar veículo:', erro);
        this.mensagemErro = 'Não foi possível carregar os detalhes do veículo.';
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}