import { Component } from '@angular/core';
import { GlobalEventService } from '../../services/global-event-service';
import { MasterJsonService } from '../../services/master-json-service';
import { DomSanitizer } from '@angular/platform-browser';
import { HintItem, Report } from '../../common/types';
import { Subscription } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface MatchedReportSlotItem {
    name: string,
    highlighted: boolean;
}

interface MatchedReportSlot {
    slotType: string;
    slotHint: string;
    items: MatchedReportSlotItem[];
}

interface MatchedReport {
    week: number;
    date: string;
    slots: MatchedReportSlot[];
}

@Component({
    selector: 'app-item-search-reports-panel',
    standalone: true,
    imports: [FontAwesomeModule],
    templateUrl: './item-search-reports-panel.component.html',
      styleUrl: './item-search-reports-panel.component.css'
})
export class ItemSearchReportsPanelComponent {
    private readonly searchItemsCompleteSubscription: Subscription;

    private matchedSearchItems: HintItem[] = [];

    faMagnifyingGlass = faMagnifyingGlass;
    matchedReports: MatchedReport[] = [];

    constructor(
        private readonly globalEventService: GlobalEventService,
        private readonly masterJsonService: MasterJsonService,
        private readonly sanitizer: DomSanitizer
    ) {
        this.searchItemsCompleteSubscription = this.globalEventService.onSearchItemsComplete.subscribe(matchedSearchItems => {
            this.matchedSearchItems = matchedSearchItems;
            this.searchReports();
        });
    }

    ngOnDestroy() {
        this.searchItemsCompleteSubscription.unsubscribe();
    }

    searchReports() {
        this.matchedReports = [];

        const masterData = this.masterJsonService.masterData;

        if (!masterData) { return; }

        const allMatchedReports = new Map<number, MatchedReport>();

        this.matchedSearchItems.forEach(searchItem => {
            const searchItemName = searchItem.name.toLowerCase();

            // Search every Report Hint, find the Items associated with each Hint,
            // and see if there is an Item that matches the searchItem.
            masterData.reports.forEach(report => {
                report.slots.forEach(slot => {
                    const items = this.findReportItems(slot.type, slot.hint);

                    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                        const item = items[itemIndex];

                        if (item.toLowerCase() !== searchItemName) { continue; }

                        const matchedReport = allMatchedReports.get(report.week);
                        const matchedReportSlot: MatchedReportSlot = {
                            slotType: slot.type,
                            slotHint: slot.hint,
                            items: []
                        };

                        if (matchedReport) {
                            let foundSlot: MatchedReportSlot | undefined;

                            for (let slotIndex = 0; slotIndex < matchedReport.slots.length; slotIndex++) {
                                const checkSlot = matchedReport.slots[slotIndex];

                                if (checkSlot.slotType !== slot.type || checkSlot.slotHint !== slot.hint) { continue; }

                                foundSlot = checkSlot;
                                break;
                            }

                            if (!foundSlot) {
                                matchedReportSlot.items = this.getItemsWithHighlight(items, searchItemName);
                                matchedReport.slots.push(matchedReportSlot);
                            } else {
                                matchedReportSlot.items = foundSlot.items;
                                this.updateItemsForHighlight(matchedReportSlot.items, searchItemName);
                            }
                        } else {
                            matchedReportSlot.items = this.getItemsWithHighlight(items, searchItemName);
                            allMatchedReports.set(report.week, {
                                week: report.week,
                                date: report.date,
                                slots: [matchedReportSlot]
                            });
                        }

                        break;
                    }
                });
            });
        });

        const matchedReports: MatchedReport[] = [];

        allMatchedReports.forEach((value, key) => {
            matchedReports.push(value);
        });

        matchedReports.sort((x, y) => {
            if (x.week < y.week) {
                return -1;
            }

            if (x.week > y.week) {
                return 1;
            }

            return 0;
        });

        this.matchedReports = matchedReports;
    };

    getSearchUri(name: string) {
        const searchQuery = encodeURIComponent(name).replace(/[\']/gi, '%27');
        return 'https://na.finalfantasyxiv.com/lodestone/playguide/db/search/?q=' + searchQuery;
    }

    loadReport(week: number) {
        this.globalEventService.onLoadReport.emit(week);
    }

    private updateItemsForHighlight(items: MatchedReportSlotItem[], searchItem: string) {
        const effectiveSearchItem = searchItem.toLowerCase();

        items.forEach(item => {
            if (!item.highlighted) {
                const highlighted = item.name.toLowerCase() === effectiveSearchItem;

                if (highlighted) {
                    item.highlighted = true;
                }
            }
        });
    }

    private getItemsWithHighlight(items: string[], searchItem: string) {
        const slotItems: MatchedReportSlotItem[] = [];
        const effectiveSearchItem = searchItem.toLowerCase();

        items.forEach(item => {
            const highlighted = item.toLowerCase() === effectiveSearchItem;

            slotItems.push({
                name: item,
                highlighted
            });
        });

        return slotItems;
    }

    private findReportItems(slotType: string, hint: string) {
        const items: string[] = [];
        const slots = this.masterJsonService.masterData?.slots;

        if (!slots) { return items; }

        const effectiveHint = hint.toLowerCase();

        for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
            const slot = slots[slotIndex];

            if (slot.type !== slotType || slot.hint.toLowerCase() !== effectiveHint) { continue; }

            slot.items.forEach(item => {
                items.push(item.name);
            });

            break;
        }

        return items;
    }
}
