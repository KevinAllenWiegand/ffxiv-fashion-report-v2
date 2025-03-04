import { Component } from '@angular/core';
import { MasterJsonService } from '../../services/MasterJsonService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
    templateUrl: './hint-search.component.html',
    styleUrl: './hint-search.component.css'
})
export class HintSearchComponent {
    constructor(
        private readonly masterJsonService: MasterJsonService
    ) {
    }
}
