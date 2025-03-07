import { Component } from '@angular/core';
import { MasterJsonService } from '../../services/master-json-service';
import { Report } from '../../common/types';
import { Subscription } from 'rxjs';
import { HintSearchPanelComponent } from "../hint-search-panel/hint-search-panel.component";
import { GlobalEventService } from '../../services/global-event-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HintSearchPanelComponent],
    templateUrl: './hint-search.component.html',
    styleUrl: './hint-search.component.css'
})
export class HintSearchComponent {   
    private readonly dataAvailableSubscription: Subscription | undefined;
    private readonly loadReportSubscription: Subscription;
    private currentReportData: Report | undefined;
    private currentWeekIndex = -1;

    constructor(
        private readonly masterJsonService: MasterJsonService,
        private readonly globalEventService: GlobalEventService,
        private readonly router: Router
    ) {
        if (!this.masterJsonService.isReady) {
            this.dataAvailableSubscription = masterJsonService.onDataAvailable.subscribe(() => {
                this.dataAvailableSubscription?.unsubscribe();
                this.showLatestWeek();
            });
        } else {
            this.showLatestWeek();
        }

        this.loadReportSubscription = globalEventService.onLoadReport.subscribe((week) => {
            this.showWeek(week);
        });
    }

    ngOnDestroy(): void {
        this.dataAvailableSubscription?.unsubscribe();
        this.loadReportSubscription.unsubscribe;
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

    showWeek(week: number) {
        const reports = this.masterJsonService.masterData?.reports;

        if (!reports || !reports.length) { return; }

        for (let index = 0; index < reports.length; index++) {
            const report = reports[index];

            if (report.week !== week) { continue; }

            this.currentWeekIndex = index;
            this.currentReportData = reports[this.currentWeekIndex];
            this.globalEventService.onLoadReportSlot.emit(this.latestReport);
            this.router.navigate(['/']);
            break;
        }
    }

    resetSlots() {
        this.globalEventService.onResetSlots.emit();
    }
}
