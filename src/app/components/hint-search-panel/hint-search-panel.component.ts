import { SlotTypes } from '../../common/types';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hint-search-panel',
  standalone: true,
  imports: [],
  templateUrl: './hint-search-panel.component.html',
  styleUrl: './hint-search-panel.component.css'
})
export class HintSearchPanelComponent {
    get SlotTypes() { return SlotTypes; }
}
