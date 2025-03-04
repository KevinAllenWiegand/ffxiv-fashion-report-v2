import { Subscription } from 'rxjs';
import { SlotTypes, Report, Slot } from '../../common/types';
import { Component, Input } from '@angular/core';
import { GlobalEventService } from '../../services/GlobalEventService';
import { FormsModule } from '@angular/forms';
import { MasterJsonService } from '../../services/MasterJsonService';

@Component({
  selector: 'app-hint-search-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hint-search-panel.component.html',
  styleUrl: './hint-search-panel.component.css'
})
export class HintSearchPanelComponent {
    @Input()
    slotNumber = -1;

    resetSlotsSubscription: Subscription;
    loadReportSlotSubscription: Subscription;
    slotType = 'All';
    hint = '';
    matchedSlots: Slot[] = [];

    constructor(
        private readonly globalEventService: GlobalEventService,
        private readonly masterJsonService: MasterJsonService
    ) {
        this.resetSlotsSubscription = globalEventService.onResetSlots.subscribe(() => {
            this.reset();
        });

        this.loadReportSlotSubscription = globalEventService.onLoadReportSlot.subscribe((report: Report) => {
            if (this.slotNumber === -1 || !report || !report.slots || report.slots.length < this.slotNumber) {
                return;
            }

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
        // TODO: Put a timer on this so we're not firing like crazy
        this.loadResults();
    }

    loadResults() {
        const matchedSlots: Slot[] = [];

        this.masterJsonService.masterData?.slots.forEach((slot: Slot) => {
            if (((slot.type === this.slotType) || this.slotType === 'All') && slot.hint.toLowerCase().includes(this.hint.toLowerCase())) {
                matchedSlots.push(slot);
            }
        });

        this.matchedSlots = matchedSlots;
    }

    clearResults() {
        this.matchedSlots = [];
    }

    ngOnDestroy(): void {
        if (this.resetSlotsSubscription) {
            this.resetSlotsSubscription.unsubscribe();
        }
    }
}
