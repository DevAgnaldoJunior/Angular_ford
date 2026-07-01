import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { VehiclesService } from '../../services/vehicles.service';
import { Veiculo, VehicleData } from '../../models/veiculo.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;

  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;

  termoBusca: string = '';

  totalVeiculos = 0;
  totalVolume = 0;
  totalConectados = 0;
  totalAtualizacoes = 0;

  carregando = true;
  mensagemErro = '';

  


  codigoVeiculo: string = '';
  dadosVeiculo: VehicleData | null = null;
  carregandoDadosVeiculo: boolean = false;
  mensagemErroDados: string = '';



  constructor(
    private vehiclesService: VehiclesService,
    private router: Router
  ) {}

  

  ngOnInit(): void {
    this.validarUsuarioLogado();
    this.carregarVeiculos();
  }

  validarUsuarioLogado(): void {
    const usuarioStorage = localStorage.getItem('usuario');

    if (!usuarioStorage) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(usuarioStorage);
  }

  carregarVeiculos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.vehiclesService.listarVeiculos().subscribe({
      next: (resposta) => {
        this.veiculos = resposta.vehicles.map((veiculo) => {
          return {
            ...veiculo,
            image: this.obterImagemVeiculo(veiculo.vehicle)
          };
        });

        this.veiculosFiltrados = this.veiculos;

        this.veiculoSelecionado = this.veiculos.length > 0 ? this.veiculos[0] : null;

        this.calcularResumo();

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar veículos:', erro);
        this.mensagemErro = 'Não foi possível carregar os veículos.';
        this.carregando = false;
      }
    });
  }

  calcularResumo(): void {
    this.totalVeiculos = this.veiculos.length;

    this.totalVolume = this.veiculos.reduce((total, veiculo) => {
      return total + Number(veiculo.volumetotal || 0);
    }, 0);

    this.totalConectados = this.veiculos.reduce((total, veiculo) => {
      return total + Number(veiculo.connected || 0);
    }, 0);

    this.totalAtualizacoes = this.veiculos.reduce((total, veiculo) => {
      return total + Number(veiculo.softwareUpdates || 0);
    }, 0);
  }

  selecionarVeiculo(id: string): void {
    const encontrado = this.veiculos.find((veiculo) => String(veiculo.id) === String(id));

    this.veiculoSelecionado = encontrado || null;
  }

  verDetalhesVeiculo(id: number | string): void {
  this.router.navigate(['/dashboard/vehicle', id]);
  }

  obterImagemVeiculo(nomeVeiculo: string): string {
  const nome = nomeVeiculo.toLowerCase();

  if (nome.includes('bronco')) {
    return '/img/broncoSport.png';
  }

  if (nome.includes('mustang')) {
    return '/img/mustang.png';
  }

  if (nome.includes('ranger')) {
    return '/img/ranger.png';
  }

  if (nome.includes('territory')) {
    return '/img/territory.png';
  }

  return '/img/ford.png';
  }

  filtrarVeiculos(): void {
  const termo = this.termoBusca.toLowerCase().trim();

  if (!termo) {
    this.veiculosFiltrados = this.veiculos;
    return;
  }

  this.veiculosFiltrados = this.veiculos.filter((veiculo) => {
    return veiculo.vehicle.toLowerCase().includes(termo);
  });
  }

  buscarDadosVeiculo(): void {
    if (!this.codigoVeiculo.trim()) {
      this.mensagemErroDados = 'Informe o código do veículo.';
      this.dadosVeiculo = null;
      return;
    }

    this.carregandoDadosVeiculo = true;
    this.mensagemErroDados = '';
    this.dadosVeiculo = null;

    this.vehiclesService.buscarDadosVeiculo(this.codigoVeiculo).subscribe({
      next: (dados) => {
        this.dadosVeiculo = dados;
        this.carregandoDadosVeiculo = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar dados do veículo:', erro);
        this.mensagemErroDados = 'Não foi possível buscar os dados do veículo.';
        this.carregandoDadosVeiculo = false;
      }
    });
  }

 
}