import { Component } from '@angular/core';
import { MasterJsonService } from '../services/MasterJsonService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor(
        private readonly masterJsonService: MasterJsonService
    ) {
    }

    get slotCount() { return this.masterJsonService.slotCount; }
    get reportCount() { return this.masterJsonService.reportCount; }
}
