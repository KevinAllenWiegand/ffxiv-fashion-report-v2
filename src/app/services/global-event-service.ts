import { EventEmitter, Injectable } from "@angular/core";
import { Report } from '../common/types';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventService {
    onResetSlots = new EventEmitter<void>();
    onLoadReportSlot = new EventEmitter<Report>();
}