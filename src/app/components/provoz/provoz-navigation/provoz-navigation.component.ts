import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-provoz-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './provoz-navigation.component.html',
  styleUrls: ['./provoz-navigation.component.scss']
})
export class ProvozNavigationComponent {
  navItems: NavItem[] = [
    { label: 'Sázení', icon: '🌱', link: '/provoz/planting' },
    { label: 'Pěstírna', icon: '🏠', link: '/growing-room' },
    { label: 'Přesun', icon: '↔️', link: '/provoz/transfer' },
    { label: 'Sklizeň', icon: '✂️', link: '/provoz/harvest' },
    { label: 'Balení', icon: '📦', link: '/provoz/packaging' },
    { label: 'Doručení', icon: '🚚', link: '/provoz/delivery' },
    { label: 'Čištění', icon: '🧼', link: '/provoz/cleaning' }
  ];
}
