import { Component } from '@angular/core';
import { ItemSearchItemsPanelComponent } from '../item-search-items-panel/item-search-items-panel.component';
import { ItemSearchReportsPanelComponent } from '../item-search-reports-panel/item-search-reports-panel.component';
import { FormsModule } from '@angular/forms';
import { GlobalEventService } from '../../services/global-event-service';

@Component({
    selector: 'app-item-search',
    standalone: true,
    imports: [FormsModule, ItemSearchItemsPanelComponent, ItemSearchReportsPanelComponent],
    templateUrl: './item-search.component.html',
    styleUrl: './item-search.component.css'
})
export class ItemSearchComponent {
    private searchTimeoutObject: any;

    itemName: string = '';

    constructor(
        private readonly globalEventService: GlobalEventService
    ) {
    }

    itemNameChanged() {
        if (this.searchTimeoutObject) {
            clearTimeout(this.searchTimeoutObject);
        }

        this.searchTimeoutObject = setTimeout(() => {
            this.loadResults();
        }, 500);
    }

    loadResults() {
        this.globalEventService.onSearchItems.emit(this.itemName);
    }
}
