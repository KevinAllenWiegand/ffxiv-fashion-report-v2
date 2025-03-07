import { Component } from '@angular/core';
import { GlobalEventService } from '../../services/global-event-service';
import { Subscription } from 'rxjs';
import { MasterJsonService } from '../../services/master-json-service';
import { HintItem } from '../../common/types';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-item-search-items-panel',
  standalone: true,
  imports: [],
  templateUrl: './item-search-items-panel.component.html',
  styleUrl: './item-search-items-panel.component.css'
})
export class ItemSearchItemsPanelComponent {
    private readonly searchItemsSubscription: Subscription;

    searchTerm: string = '';
    matchedItems: HintItem[] = [];

    constructor(
        private readonly globalEventService: GlobalEventService,
        private readonly masterJsonService: MasterJsonService,
        private readonly sanitizer: DomSanitizer
    ) {
        this.searchItemsSubscription = this.globalEventService.onSearchItems.subscribe(itemName => {
            this.searchTerm = itemName;
            this.searchItems();
        });
    }

    searchItems() {
        this.matchedItems = [];
        const matchedItems: HintItem[] = [];
        
        if (this.searchTerm && this.searchTerm.length > 2) {
            const effectiveItemName = this.searchTerm.toLowerCase();
            const slots = this.masterJsonService.masterData?.slots;
            const reports = this.masterJsonService.masterData?.reports;

            if (!slots || !reports) { return; }

            slots.forEach(slot => {
                slot.items.forEach(item => {
                    if (item.name.toLowerCase().indexOf(effectiveItemName) != -1) {
                        let found = false;

                        // TODO: Not sure why findIndex isn't working - seems to always return -1.
                        for (let index = 0; index < matchedItems.length; index++) {
                            if (matchedItems[index].name !== item.name) { continue; }

                            found = true;
                            break;
                        }

                        if (!found) {
                            matchedItems.push(item);
                        }
                    }
                });
            });

            matchedItems.sort((x, y) => {               
                if (x.name < y.name) {
                    return -1;
                }

                if (x.name > y.name) {
                    return 1;
                }

                return 0;
            });

            this.matchedItems = matchedItems;
        }

        this.globalEventService.onSearchItemsComplete.emit(matchedItems);
    }

    highlightTerm(itemName: string): SafeHtml {
        let result = itemName;
        const index = itemName.toLowerCase().indexOf(this.searchTerm.toLowerCase());

        if (index !== -1) {
            if (index === 0) {
                const firstPart = itemName.substring(0, this.searchTerm.length);
                const secondPart = itemName.substring(this.searchTerm.length);

                result = `<span class='highlighted'>${firstPart}</span>${secondPart}`;
            } else {
                const firstPart = itemName.substring(0, index);
                const highlightedPart = itemName.substring(index, index + this.searchTerm.length);
                const lastPart = itemName.substring(index + this.searchTerm.length);

                result = `${firstPart}<span class='highlighted'>${highlightedPart}</span>${lastPart}`;
            }
        }

        return this.sanitizer.bypassSecurityTrustHtml(result);
    }

    ngOnDestroy() {
        this.searchItemsSubscription.unsubscribe();
    }
}
