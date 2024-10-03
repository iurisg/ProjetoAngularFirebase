import { Component } from '@angular/core';
import { AuthenticateService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Importar do AngularFire
import { MessageService } from '../services/message.service'; 
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { environment } from '../../environments/environment'; 
import { OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

// Para usar as configurações do ambiente

// Inicializar Firebase usando configurações do environment
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, '');

// Ler dados em tempo real
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data); // Aqui você pode manipular os dados recebidos
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  isLoading: boolean = false;
   

    
  
    ngOnInit() {
      this.renderChart();
    }

  constructor(
    private _authentication: AuthenticateService,
    private storage: AngularFireStorage, // AngularFireStorage adicionado
    private messageService: MessageService // MessageService adicionado
  ) {}

  criarConta(dados: any) {
    console.log(dados);
    this._authentication.register(dados.email, dados.senha);
  }

  fazerLogin(dados: any) {
    console.log(dados);
  }
  renderChart() {
    // Dados extraídos (como exemplo, usei os mesmos que mencionou no arquivo JSON)
    const candidatos = {
      "15000": { "nome": "BETO DO ESPORTE", "votos": [45, 2, 8, 19] },
      "15123": { "nome": "BETIM", "votos": [4, 2, 96, 8] },
      "15333": { "nome": "MONIQUE", "votos": [3, 26, 19, 30] },
      "22123": { "nome": "KITO", "votos": [28, 44, 71, 39] },
      "22222": { "nome": "DRA KATH ANNE", "votos": [6, 18, 25, 39] },
      "22580": { "nome": "ORLANDO", "votos": [8, 8, 44, 13] }
    };

    // Preparando os dados para o gráfico
    const labels = Object.values(candidatos).map(candidato => candidato.nome); // Nomes dos candidatos
    const votos = Object.values(candidatos).map(candidato => candidato.votos.reduce((acc, curr) => acc + curr, 0)); // Somando os votos

    // Criando o gráfico de barras
    const ctx = document.getElementById('votosChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Votos por Candidato',
          data: votos,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

