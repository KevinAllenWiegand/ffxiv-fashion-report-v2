import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterData } from '../common/types';

@Injectable({
    providedIn: 'root'
})
export class MasterJsonService {
    private masterData: MasterData | undefined;
    
    constructor(
        private readonly httpClient: HttpClient
    ) {
        this.httpClient.get('master.json').subscribe((data: any) => {
            this.masterData = data;
        });
    }
}