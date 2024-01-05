import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";

import { Observable } from "rxjs";

import { DataService } from "./services/data.service";
import { CurrencyCodesEnum } from "./enums/currency-codes.enum";
import { FormModel } from "./interfaces/form.model";
import { HeaderComponent } from "./components/header/header.component";
import { CurrencyRatesType, CurrencyResponseModel } from "./interfaces/currency-response.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderComponent, KeyValuePipe, DecimalPipe, CurrencyPipe, FormsModule],
})
export class AppComponent implements OnInit {
  public rates: CurrencyRatesType = {} as CurrencyRatesType;
  public headerUsd = 0;
  public headerEur = 0;
  public currencies = CurrencyCodesEnum;
  public mainCurrency = CurrencyCodesEnum.UAH;
  public firstForm: FormModel = {
    amount: null,
    currency: this.mainCurrency,
  };
  public lastForm: FormModel = {
    amount: null,
    currency: CurrencyCodesEnum.USD,
  }

  private dataService = inject(DataService);

  public ngOnInit(): void {
    this.getRates(CurrencyCodesEnum.UAH).subscribe((data: CurrencyResponseModel) => {
      this.rates = data[CurrencyCodesEnum.UAH];
      this.mainCurrency = CurrencyCodesEnum.UAH;
      this.headerUsd = 1 / this.rates[CurrencyCodesEnum.USD];
      this.headerEur = 1 / this.rates[CurrencyCodesEnum.EUR];
    })
  }

  public onChangeFirstForm(form: NgForm): void {
    if (form.form.value.currency === this.mainCurrency) {
      this.lastForm.amount = parseFloat((form.form.value.amount * this.rates[this.lastForm.currency]).toFixed(3));
    } else {
      this.getRates(form.form.value.currency).subscribe((data: CurrencyResponseModel) => {
        this.rates = data[form.form.value.currency];
        this.mainCurrency = form.form.value.currency;
        this.onChangeFirstForm(form)
      })
    }
  }

  public onChangeLastForm(form: NgForm): void {
    if (this.firstForm.currency === this.mainCurrency) {
      this.firstForm.amount = parseFloat((form.form.value.amount / this.rates[form.form.value.currency]).toFixed(3));
    }
  }

  public doValidate(char: KeyboardEvent): boolean {
    const charCodeDash = 45;
    const charCodeE = 101;
    return char.charCode !== charCodeDash && char.charCode !== charCodeE;
  }

  private getRates(currency: CurrencyCodesEnum): Observable<CurrencyResponseModel> {
    return this.dataService.getRates(currency);
  }

}
