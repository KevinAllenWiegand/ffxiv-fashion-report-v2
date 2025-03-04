import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterData } from '../../types';

@Injectable({
    providedIn: 'root'
})
export class MasterJsonService {
    private masterData: MasterData | undefined;
    private slots = 0;
    private reports = 0;

    constructor(
        private readonly httpClient: HttpClient
    ) {
        this.httpClient.get('master.json').subscribe((data: any) => {
            this.masterData = data;
        });
    }

    get slotCount() { return this.masterData?.slots.length; }
    get reportCount() { return this.masterData?.reports.length; }
}