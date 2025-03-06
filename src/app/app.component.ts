import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MasterJsonService } from './services/master-json-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private dataAvailableSubscription: Subscription | undefined;

    title = 'ffxiv-fashion-report-v2';
    active: any;
    isOutdated = false;

    constructor(
        private readonly masterJsonService: MasterJsonService
    ) {
        if (!masterJsonService.isReady) {
            this.dataAvailableSubscription = masterJsonService.onDataAvailable.subscribe(() => {
                this.dataAvailableSubscription?.unsubscribe();
                this.checkIfIsOutdated();
            });
        } else {
            this.checkIfIsOutdated();
        }
    }

    ngOnDestroy(): void {
        this.dataAvailableSubscription?.unsubscribe();
    }

    checkIfIsOutdated() {
        const offsets = [-2, -3, 3, 2, 1, 0, -1];
        const today = new Date();
        const currentWeekDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        currentWeekDate.setDate(currentWeekDate.getDate() + offsets[currentWeekDate.getDay()]);

        const masterData = this.masterJsonService.masterData;

        if (!masterData) {
            this.isOutdated = true;
            return;
        }

        const firstWeekNumber = masterData.reports[0].week;
        const firstWeekDateParts = masterData.reports[0].date.split('-');
        const firstWeekDate = new Date(parseInt(firstWeekDateParts[0], 10), parseInt(firstWeekDateParts[1], 10) - 1, parseInt(firstWeekDateParts[2], 10));
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const numberOfDaysSince = Math.ceil((currentWeekDate.getTime() - firstWeekDate.getTime()) / millisecondsPerDay);
        const numberOfWeeksSince = Math.ceil(numberOfDaysSince / 7);
        const currentWeek = firstWeekNumber + numberOfWeeksSince;
        const lastAvailableWeek = masterData.reports[masterData.reports.length - 1].week;

        this.isOutdated = currentWeek !== lastAvailableWeek;
    }
}
