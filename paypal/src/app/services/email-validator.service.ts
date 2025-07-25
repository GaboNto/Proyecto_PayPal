import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmailValidatorService {
    private apiKey = '46a842599525088a815c380e668f1b11';

    constructor(private http: HttpClient) { }

    validarEmail(email: string): Observable<any> {
        const url = `https://apilayer.net/api/check?access_key=${this.apiKey}&email=${email}&smtp=1&format=1`;
        return this.http.get(url);
    }
}
