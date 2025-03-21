import { Subscription } from 'rxjs';
import { SlotTypes, Report, Slot, HintItem } from '../../common/types';
import { Component, Input } from '@angular/core';
import { GlobalEventService } from '../../services/global-event-service';
import { FormsModule } from '@angular/forms';
import { MasterJsonService } from '../../services/master-json-service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { OwnedItemsService } from '../../services/owned-items-service';

@Component({
  selector: 'app-hint-search-panel',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './hint-search-panel.component.html',
  styleUrl: './hint-search-panel.component.css'
})
export class HintSearchPanelComponent {
    @Input()
    slotNumber = -1;

    private readonly resetSlotsSubscription: Subscription;
    private readonly loadReportSlotSubscription: Subscription;

    private searchTimeoutObject: any;

    faMagnifyingGlass = faMagnifyingGlass;
    slotType = 'All';
    hint = '';
    matchedSlots: Slot[] = [];

    constructor(
        private readonly globalEventService: GlobalEventService,
        private readonly masterJsonService: MasterJsonService,
        private readonly ownedItemsService: OwnedItemsService
    ) {
        this.resetSlotsSubscription = globalEventService.onResetSlots.subscribe(() => {
            this.reset();
        });

        this.loadReportSlotSubscription = globalEventService.onLoadReportSlot.subscribe((report: Report) => {
            if (this.slotNumber === -1 || !report || !report.slots || report.slots.length < this.slotNumber) {
                return;
            }

            this.reset();

            const slot = report.slots[this.slotNumber];

            if (!slot) { return; }

            this.slotType = slot.type;
            this.hint = slot.hint;
            this.loadResults();
        });
    }

    get SlotTypes() { return SlotTypes; }

    reset() {
        this.slotType = 'All';
        this.hint = '';
        this.clearResults();
    }

    slotTypeChanged() {
        this.loadResults();
    }

    hintChanged() {
        if (this.searchTimeoutObject) {
            clearTimeout(this.searchTimeoutObject);
        }

        this.searchTimeoutObject = setTimeout(() => {
            this.loadResults();
        }, 500);
    }

    loadResults() {
        this.matchedSlots = [];

        const matchedSlots: Slot[] = [];

        if (this.hint && this.hint.length > 2) {
            this.masterJsonService.masterData?.slots.forEach((slot: Slot) => {
                if (((slot.type === this.slotType) || this.slotType === 'All') && slot.hint.toLowerCase().indexOf(this.hint.toLowerCase()) !== -1) {
                    matchedSlots.push(slot);
                }
            });
        }

        this.matchedSlots = matchedSlots;
    }

    itemSelectionChanged(event: any, item: HintItem) {
        const isChecked = event.target['checked'];

        if (isChecked) {
            this.ownedItemsService.add(item.name);
        } else {
            this.ownedItemsService.remove(item.name);
        }
    }

    isOwned(name: string) {
        return this.ownedItemsService.isOwned(name);
    }

    clearResults() {
        this.matchedSlots = [];
    }

    getSearchUri(name: string) {
        const searchQuery = encodeURIComponent(name).replace(/[\']/gi, '%27');
        return 'https://na.finalfantasyxiv.com/lodestone/playguide/db/search/?q=' + searchQuery;
    }

    ngOnDestroy(): void {
        this.resetSlotsSubscription.unsubscribe();
        this.loadReportSlotSubscription.unsubscribe();
    }
}
