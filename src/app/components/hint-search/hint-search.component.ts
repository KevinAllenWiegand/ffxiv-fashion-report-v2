import { Component } from '@angular/core';
import { MasterJsonService } from '../../services/MasterJsonService';
import { Report, SlotTypes } from '../../common/types';
import { Subscription } from 'rxjs';
import { HintSearchPanelComponent } from "../hint-search-panel/hint-search-panel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HintSearchPanelComponent],
    templateUrl: './hint-search.component.html',
    styleUrl: './hint-search.component.css'
})
export class HintSearchComponent {
    private dataAvailableSubscription: Subscription;
    private latestReportData: Report | undefined;

    constructor(
        private readonly masterJsonService: MasterJsonService
    ) {
        this.dataAvailableSubscription = masterJsonService.dataAvailable.subscribe(() => {
            this.dataAvailableSubscription.unsubscribe();

            const reports = masterJsonService.masterData?.reports;

            if (reports && reports.length) {
                this.latestReportData = reports[reports.length - 1];
            }
        });
    }

    ngOnDestroy(): void {
        if (this.dataAvailableSubscription) {
            this.dataAvailableSubscription.unsubscribe();
        }
    }

    get latestReport() { return this.latestReportData; }
}
