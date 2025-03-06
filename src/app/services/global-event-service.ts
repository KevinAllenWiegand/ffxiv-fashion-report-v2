import { EventEmitter, Injectable } from "@angular/core";
import { HintItem, Report } from '../common/types';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventService {
    onResetSlots = new EventEmitter<void>();
    onLoadReportSlot = new EventEmitter<Report>();
    onSearchItems = new EventEmitter<string>();
    onSearchItemsComplete = new EventEmitter<HintItem[]>();
}