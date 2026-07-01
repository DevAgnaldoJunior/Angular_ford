export interface Veiculo {
  id: number | string;
  vehicle: string;
  volumetotal: number | string;
  connected: number | string;
  softwareUpdates: number | string;
  image?: string;
}

export interface Veiculos extends Array<Veiculo> {}

export interface VeiculosAPI {
  vehicles: Veiculos;
}

export interface VehicleData {
  id?: number | string;
  odometro: number | string;
  nivelCombustivel: number | string;
  status: string;
  lat: number | string;
  long: number | string;
}