import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable} from "rxjs";
import { CurrencyResponseModel } from "../interfaces/currency-response.model";

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getRates(currency: string): Observable<CurrencyResponseModel> {
    return this.http.get<CurrencyResponseModel>(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`);
  }
}
