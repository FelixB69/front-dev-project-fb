import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salary, Datas, Stats } from '../models/salary.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private baseUrl = 'https://api-felixberger.fr/salaries';
  constructor(private http: HttpClient) {}

  // fetchData(): Observable<any> {
  //   return this.http.get<Datas>(`${this.baseUrl}/fetch`).pipe(
  //     catchError((error) => {
  //       console.error('HTTP Error:', error);
  //       return throwError(
  //         () => new Error('Erreur lors de la récupération des données.')
  //       );
  //     })
  //   );
  // }

  private addCacheBusting(): HttpParams {
    return new HttpParams().set('_', Date.now().toString());
  }

  getSalaries(): Observable<Salary[]> {
    return this.http
      .get<Salary[]>(this.baseUrl, { params: this.addCacheBusting() })
      .pipe(catchError(this.handleError));
  }

  getCities(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/cities`, {
        params: this.addCacheBusting(),
      })
      .pipe(catchError(this.handleError));
  }

  getSalariesByCity(city: string): Observable<Salary[]> {
    const url = `${this.baseUrl}/city/${city}`;
    return this.http
      .get<Salary[]>(url, { params: this.addCacheBusting() })
      .pipe(catchError(this.handleError));
  }

  getSalariesWithFilters(
    city?: string,
    rangeName?: string,
    year?: string
  ): Observable<Salary[]> {
    let params = this.addCacheBusting();

    if (city) params = params.set('city', city);
    if (rangeName) params = params.set('rangeName', rangeName);
    if (year) params = params.set('year', year);

    return this.http
      .get<Salary[]>(`${this.baseUrl}/filter`, { params })
      .pipe(catchError(this.handleError));
  }

  getSalariesRanges(): Observable<Stats[]> {
    return this.http
      .get<Stats[]>(`${this.baseUrl}/ranges`, {
        params: this.addCacheBusting(),
      })
      .pipe(catchError(this.handleError));
  }

  getSalariesYears(): Observable<Stats[]> {
    return this.http
      .get<Stats[]>(`${this.baseUrl}/years`, { params: this.addCacheBusting() })
      .pipe(catchError(this.handleError));
  }

  getSalariesCity(): Observable<Stats[]> {
    return this.http
      .get<Stats[]>(`${this.baseUrl}/city`, { params: this.addCacheBusting() })
      .pipe(catchError(this.handleError));
  }

  getSalariesDatas(): Observable<Datas> {
    return this.http
      .get<Datas>(`${this.baseUrl}/datas`, { params: this.addCacheBusting() })
      .pipe(catchError(this.handleError));
  }

  getScore(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/score`, {
      params: this.addCacheBusting(),
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Erreur réseau :', error.error);
    } else {
      console.error(`Erreur serveur ${error.status} :`, error.error);
    }

    return throwError(
      () =>
        new Error(
          'Erreur lors de la récupération des données. Réessayez plus tard.'
        )
    );
  }
}
