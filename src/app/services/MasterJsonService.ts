import { Injectable } from '@angular/core';
import master from '../../data/master.json';

@Injectable({
    providedIn: 'root'
})
export class MasterJsonService {
    private readonly slots;
    private readonly reports;;

    constructor() {
        this.slots = master.slots;
        this.reports = master.reports;
    }

    get slotCount() { return this.slots.length; }
    get reportCount() { return this.reports.length; }
}