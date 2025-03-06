import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MasterData } from '../common/types';

@Injectable({
    providedIn: 'root'
})
export class MasterJsonService {
    onDataAvailable = new EventEmitter<void>();
    masterData: MasterData | undefined;
    isReady = false;
    
    constructor(
        private readonly httpClient: HttpClient
    ) {
        this.httpClient.get('master.json').subscribe((data: any) => {
            this.masterData = data;
            this.isReady = true;
            this.onDataAvailable.emit();
        });
    }
}