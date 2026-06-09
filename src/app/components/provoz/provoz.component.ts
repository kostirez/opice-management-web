import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Tile {
  title: string;
  description: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-provoz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="provoz-container">
      <h1>Provoz</h1>
      <div class="tiles-grid">
        <div *ngFor="let tile of tiles" [routerLink]="tile.link" class="tile-card">
          <div class="tile-icon">{{ tile.icon }}</div>
          <div class="tile-content">
            <h3>{{ tile.title }}</h3>
            <p>{{ tile.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .provoz-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #2c5530;
      margin-bottom: 2rem;
    }

    .tiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .tile-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid #eee;
    }

    .tile-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
      border-color: #2c5530;
    }

    .tile-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .tile-content h3 {
      margin: 0 0 0.5rem 0;
      color: #2c5530;
    }

    .tile-content p {
      margin: 0;
      color: #666;
    }

    @media (max-width: 600px) {
      .tiles-grid {
        grid-template-columns: 1fr;
      }

      .provoz-container {
        padding: 1rem;
      }
    }
  `]
})
export class ProvozComponent {
  tiles: Tile[] = [
    { title: 'Sázení', description: 'Správa sázení nových rostlin', link: '/provoz/planting', icon: '🌱' },
    { title: 'Přesun', description: 'Přesun táců mezi stanovišti', link: '/provoz/transfer', icon: '↔️' },
    { title: 'Sklizeň', description: 'Evidence sklizně a výnosů', link: '/provoz/harvest', icon: '✂️' },
    { title: 'Balení', description: 'Balení a příprava k expedici', link: '/provoz/packaging', icon: '📦' },
    { title: 'Doručení', description: 'Správa rozvozů a doručení', link: '/provoz/delivery', icon: '🚚' },
    { title: 'Čištění', description: 'Plánování a evidence čištění', link: '/provoz/cleaning', icon: '🧼' }
  ];
}
