import { Component, OnInit } from '@angular/core';
import { ApiService, Post } from './services/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  titulo = 'Consumo de API pública';
  posts: Post[] = [];
  postsPaginados: Post[] = [];
  paginaActual = 1;
  tamanoPagina = 5;
  cargando = false;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarPosts();
  }

  cargarPosts(): void {
    this.cargando = true;
    this.error = '';

    this.apiService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.paginaActual = 1;
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los datos. Intenta nuevamente más tarde.';
        this.posts = [];
        this.postsPaginados = [];
        this.cargando = false;
      }
    });
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    this.postsPaginados = this.posts.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.posts.length / this.tamanoPagina) || 1;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }
}
