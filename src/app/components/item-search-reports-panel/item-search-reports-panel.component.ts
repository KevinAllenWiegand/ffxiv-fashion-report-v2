import { Component } from '@angular/core';
import { GlobalEventService } from '../../services/global-event-service';
import { MasterJsonService } from '../../services/master-json-service';
import { DomSanitizer } from '@angular/platform-browser';
import { HintItem } from '../../common/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-search-reports-panel',
  standalone: true,
  imports: [],
  templateUrl: './item-search-reports-panel.component.html',
  styleUrl: './item-search-reports-panel.component.css'
})
export class ItemSearchReportsPanelComponent {
    private readonly searchItemsCompleteSubscription: Subscription;

    private matchedItems: HintItem[] = [];

    constructor(
        private readonly globalEventService: GlobalEventService,
        private readonly masterJsonService: MasterJsonService,
        private readonly sanitizer: DomSanitizer
    ) {
        this.searchItemsCompleteSubscription = this.globalEventService.onSearchItemsComplete.subscribe(matchedItems => {
            this.matchedItems = matchedItems;
            this.searchReports();
        });
    }

    searchReports() {
        
    };
}
