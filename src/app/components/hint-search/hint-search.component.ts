import { Component } from '@angular/core';
import { MasterJsonService } from '../../services/MasterJsonService';
import { Report } from '../../common/types';
import { Subscription } from 'rxjs';
import { HintSearchPanelComponent } from "../hint-search-panel/hint-search-panel.component";
import { GlobalEventService } from '../../services/GlobalEventService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HintSearchPanelComponent],
    templateUrl: './hint-search.component.html',
    styleUrl: './hint-search.component.css'
})
export class HintSearchComponent {   
    private dataAvailableSubscription: Subscription;
    private currentReportData: Report | undefined;
    private currentWeekIndex = -1;

    constructor(
        private readonly masterJsonService: MasterJsonService,
        private readonly globalEventService: GlobalEventService
    ) {
        this.dataAvailableSubscription = masterJsonService.onDataAvailable.subscribe(() => {
            this.dataAvailableSubscription.unsubscribe();

            const reports = masterJsonService.masterData?.reports;

            if (reports && reports.length) {
                this.currentWeekIndex = reports.length - 1;
                this.currentReportData = reports[this.currentWeekIndex];
                globalEventService.onLoadReportSlot.emit(this.latestReport);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.dataAvailableSubscription) {
            this.dataAvailableSubscription.unsubscribe();
        }
    }

    get latestReport() { return this.currentReportData; }

    showLatestWeek() {
        const reports = this.masterJsonService.masterData?.reports;

        if (!reports || !reports.length) { return; }

        this.currentWeekIndex = reports.length - 1;
        this.currentReportData = reports[this.currentWeekIndex];
        this.globalEventService.onLoadReportSlot.emit(this.latestReport);
    }

    showPreviousWeek() {
        const reports = this.masterJsonService.masterData?.reports;

        if (!reports || !reports.length) { return; }
        if (this.currentWeekIndex - 1 < 0) { return; }

        this.currentWeekIndex--;
        this.currentReportData = reports[this.currentWeekIndex];
        this.globalEventService.onLoadReportSlot.emit(this.latestReport);
    }

    showNextWeek() {
        const reports = this.masterJsonService.masterData?.reports;

        if (!reports || !reports.length) { return; }
        if (this.currentWeekIndex + 1 >= reports.length) { return; }

        this.currentWeekIndex++;
        this.currentReportData = reports[this.currentWeekIndex];
        this.globalEventService.onLoadReportSlot.emit(this.latestReport);
    }

    resetSlots() {
        this.globalEventService.onResetSlots.emit();
    }
}
