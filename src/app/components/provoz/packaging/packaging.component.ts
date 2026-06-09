import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BatchHarvestService } from '../../../services/batch-harvest.service';
import {OrderForDelivery, OrderService} from '../../../services/order.service';
import { BatchDeliveryService } from '../../../services/batch-delivery.service';
import { PlantService } from '../../../services/plant.service';
import { RecipeService } from '../../../services/recipe.service';
import { BatchHarvestDto, BatchDeliveryDto, CropBatchDto, CropBatchUnit, PlantDto, RecipeBatchDto, RecipeDto } from '../../../models';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-packaging',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './packaging.component.html',
  styleUrls: ['./packaging.component.scss']
})
export class PackagingComponent implements OnInit {
  todayBatchHarvest: BatchHarvestDto | null = null;
  deliveryOrders: any[] = [];
  availablePlants: PlantDto[] = [];
  availableRecipes: RecipeDto[] = [];
  loading = false;
  creatingDelivery = false;

  // For creating batch delivery
  activeDeliveries: {
    order?: any;
    batchDeliveryId?: string;
    deliveredItems: RecipeBatchDto[];
    creating: boolean;
    saved?: boolean;
  }[] = [];

  availableUnits: CropBatchUnit[] = ['GRAM', 'BOX_S', 'BOX_M', 'BOX_L'];

  constructor(
    private batchHarvestService: BatchHarvestService,
    private orderService: OrderService,
    private batchDeliveryService: BatchDeliveryService,
    private plantService: PlantService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadTodayBatchHarvest();
    this.loadDeliveryOrders();
    this.loadPlants();
    this.loadRecipes();
  }

  loadRecipes() {
    this.recipeService.getRecipes({ 'pagination[limit]': -1, 'populate': 'items.plant' }).subscribe({
      next: (response) => {
        this.availableRecipes = response.data;
      },
      error: (err) => {
        console.error('Error loading recipes', err);
      }
    });
  }

  loadPlants() {
    this.plantService.getPlants({ 'pagination[limit]': -1 }).subscribe({
      next: (response) => {
        this.availablePlants = response.data;
      },
      error: (err) => {
        console.error('Error loading plants', err);
      }
    });
  }

  loadTodayBatchHarvest() {
    this.loading = true;
    const today = new Date().toISOString().split('T')[0];
    this.batchHarvestService.getBatchHarvests({
      'filters[date][$eq]': today,
      'populate': 'harvestedCrops.plant'
    }).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.todayBatchHarvest = response.data[0];
        } else {
          this.todayBatchHarvest = null;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading batch harvests', err);
        this.loading = false;
      }
    });
  }

  loadDeliveryOrders() {
    this.orderService.getDeliveryList().subscribe({
      next: (orders) => {
        this.deliveryOrders = orders;
      },
      error: (err) => {
        console.error('Error loading delivery orders', err);
      }
    });
  }

  isOrderSelected(order: any): boolean {
    return this.activeDeliveries.some(d => d.order?.orderId === order.orderId && !d.saved);
  }

  isOrderSaved(order: any): boolean {
    return this.activeDeliveries.some(d => d.order?.orderId === order.orderId && d.saved);
  }

  selectOrderForDelivery(order: any) {
    if (this.isOrderSelected(order) || this.isOrderSaved(order)) {
      return;
    }
    if (!this.todayBatchHarvest) {
      alert('Nejdříve je nutné mít dnešní sklizeň.');
      return;
    }

    const batchDelivery: Partial<BatchDeliveryDto> = {
      order: order.orderId as any,
      state: 'PENDING',
      batch_harvest: this.todayBatchHarvest.id
    };

    this.batchDeliveryService.createBatchDelivery(batchDelivery).subscribe({
      next: (response) => {
        const createdDelivery = response.data;

        // BE doesn't return full object by default, so we need to load it separately
        this.batchDeliveryService.getBatchDelivery(createdDelivery.documentId!, {
          'populate': 'expectedItems.recipe.items.plant'
        }).subscribe({
          next: (fullDeliveryResponse) => {
            const fullDelivery = fullDeliveryResponse.data;
            // Prefill deliveredItems from expectedItems
            const deliveredItems: RecipeBatchDto[] = (fullDelivery.expectedItems || []).map((item: any) => {
              const dto: RecipeBatchDto = { ...item };
              if (dto.recipe) {
                dto.packedItems = (dto.recipe.items || []).map(ri => ({
                  plant: ri.plant!,
                  amount: (ri.percent || 0) / 100 * (dto.amount || 0)
                }));
                // If unit is box, we might need a default packedAmount (number of boxes)
                if (dto.unit !== 'GRAM') {
                  dto.packedAmount = dto.amount;
                }
              }
              return dto;
            });

            this.activeDeliveries.push({
              order,
              batchDeliveryId: fullDelivery.documentId,
              deliveredItems,
              creating: false,
              saved: false
            });
          },
          error: (err) => {
            console.error('Error loading full batch delivery', err);
            alert('Chyba při načítání detailu dodávky.');
          }
        });
      },
      error: (err) => {
        console.error('Error creating initial batch delivery', err);
        alert('Chyba při vytváření batch delivery na pozadí.');
      }
    });
  }

  createUnassignedDelivery() {
    this.activeDeliveries.push({
      deliveredItems: [{ amount: 0, unit: 'GRAM' }],
      creating: false,
      saved: false
    });
  }

  comparePlants(p1: PlantDto, p2: PlantDto): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRecipes(r1: RecipeDto, r2: RecipeDto): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  addDeliveryItem(delivery: any) {
    delivery.deliveredItems.push({
      amount: 0,
      unit: 'GRAM'
    });
  }

  addPlantsFromRecipe(delivery: any, item: RecipeBatchDto, itemIndex: number) {
    if (!item.recipe || !item.recipe.items || !item.amount) return;

    const recipeItems = item.recipe.items;
    const totalAmount = item.amount;

    // Create plant items based on percentages
    const newPlantItems: RecipeBatchDto[] = recipeItems.map(ri => ({
      plant: ri.plant,
      amount: (ri.percent || 0) / 100 * totalAmount,
      unit: item.unit,
      packed: false,
      packedAmount: (ri.percent || 0) / 100 * totalAmount
    }));

    // Replace the recipe item with plant items, or just add them?
    // User said "add plants base on recipe", usually this means expanding it.
    // Let's replace the recipe item with its components.
    delivery.deliveredItems.splice(itemIndex, 1, ...newPlantItems);
  }

  packItem(delivery: any, item: RecipeBatchDto) {
    item.packed = true;

    // Logic to update todayBatchHarvest.usedHarvest (on FE only as requested)
    if (this.todayBatchHarvest) {
      if (!this.todayBatchHarvest.usedHarvest) {
        this.todayBatchHarvest.usedHarvest = [];
      }

      if (item.plant) {
        if (item.packedAmount === undefined) {
          item.packedAmount = item.amount;
        }
        this.todayBatchHarvest.usedHarvest.push({
          plant: item.plant,
          amount: item.packedAmount,
          unit: 'GRAM'
        });
      } else if (item.recipe && item.packedItems) {
        item.packedItems.forEach(pi => {
          this.todayBatchHarvest!.usedHarvest!.push({
            plant: pi.plant,
            amount: pi.amount,
            unit: 'GRAM'
          });
        });
      }

      // Save the updated usedHarvest to BE
      this.batchHarvestService.updateBatchHarvest(this.todayBatchHarvest.documentId!, {
        usedHarvest: this.todayBatchHarvest.usedHarvest.map(uh => ({
          plant: uh.plant?.id as any,
          amount: uh.amount,
          unit: uh.unit
        }))
      }).subscribe({
        error: (err) => console.error('Error updating batch harvest with used crops', err)
      });
    }

    // Check if all items in this delivery are packed
    const allPacked = delivery.deliveredItems.every((i: RecipeBatchDto) => i.packed);
    if (allPacked) {
      // Auto-save when all items are packed
      const deliveryIndex = this.activeDeliveries.indexOf(delivery);
      if (deliveryIndex !== -1) {
        this.saveBatchDelivery(delivery, deliveryIndex);
      }
    }
  }

  initPackedItems(item: RecipeBatchDto) {
    if (item.recipe && item.recipe.items && !item.packedItems) {
      item.packedItems = item.recipe.items.map(ri => ({
        plant: ri.plant!,
        amount: (ri.percent || 0) / 100 * (item.amount || 0)
      }));
    }
  }

  removeDeliveryItem(delivery: any, index: number) {
    delivery.deliveredItems.splice(index, 1);
  }

  removeActiveDelivery(index: number) {
    this.activeDeliveries.splice(index, 1);
  }

  saveBatchDelivery(delivery: any, index: number) {
    if (!delivery.batchDeliveryId) {
      // Handle unassigned or non-BE-created deliveries if needed
      this.createBatchDeliveryManually(delivery, index);
      return;
    }

    delivery.creating = true;
    const batchDelivery: Partial<BatchDeliveryDto> = {
      state: 'PACKED',
      deliveredAt: undefined,
      deliveredItems: delivery.deliveredItems.map((item: any) => ({
        plant: item.plant?.id,
        recipe: item.recipe?.id,
        amount: item.packedAmount || item.amount,
        unit: item.unit
      }))
    };

    this.batchDeliveryService.updateBatchDelivery(delivery.batchDeliveryId, batchDelivery).subscribe({
      next: () => {
        delivery.creating = false;
        delivery.saved = true;
      },
      error: (err) => {
        console.error('Error updating batch delivery', err);
        delivery.creating = false;
      }
    });
  }

  private createBatchDeliveryManually(delivery: any, index: number) {
    delivery.creating = true;
    const batchDelivery: Partial<BatchDeliveryDto> = {
      order: delivery.order?.orderId as any,
      state: 'PACKED',
      deliveredAt: undefined,
      deliveredItems: delivery.deliveredItems.map((item: any) => ({
        recipe: item.recipe?.id,
        plant: item.plant?.id,
        amount: item.packedAmount || item.amount,
        unit: item.unit
      })),
      batch_harvest: this.todayBatchHarvest?.id
    };

    this.batchDeliveryService.createBatchDelivery(batchDelivery).subscribe({
      next: () => {
        delivery.creating = false;
        delivery.saved = true;
      },
      error: (err) => {
        console.error('Error creating manual batch delivery', err);
        delivery.creating = false;
      }
    });
  }
}
