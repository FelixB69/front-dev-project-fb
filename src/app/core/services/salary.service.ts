import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salary, Datas, Stats } from '../models/salary.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private baseUrl = 'http://localhost:3000/salaries';
  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    return this.http.get<Datas>(`${this.baseUrl}/fetch`).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(
          () => new Error('Erreur lors de la récupération des données.')
        );
      })
    );
  }

  getSalaries(): Observable<Salary[]> {
    return this.http
      .get<any[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getCities(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/cities`)
      .pipe(catchError(this.handleError));
  }

  getSalariesByCity(city: string): Observable<Salary[]> {
    const url = `http://localhost:3000/salaries/city/${city}`;
    console.log('Calling API:', url);
    return this.http.get<Salary[]>(url).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(
          () => new Error('Erreur lors de la récupération des salaires.')
        );
      })
    );
  }

  getSalariesWithFilters(
    city?: string,
    rangeName?: string,
    year?: string
  ): Observable<Salary[]> {
    let url = `${this.baseUrl}/filter`;

    const params: { [key: string]: string } = {};

    if (city) {
      params['city'] = city; // Notation avec crochets
    }

    if (rangeName) {
      params['rangeName'] = rangeName; // Notation avec crochets
    }

    if (year) {
      params['year'] = year; // Notation avec crochets
    }

    return this.http.get<Salary[]>(url, { params }).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error);
        return throwError(
          () =>
            new Error(
              'Erreur lors de la récupération des salaires avec filtres.'
            )
        );
      })
    );
  }

  getSalariesRanges(): Observable<Stats[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/ranges`)
      .pipe(catchError(this.handleError));
  }

  getSalariesYears(): Observable<Stats[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/years`)
      .pipe(catchError(this.handleError));
  }

  getSalariesCity(): Observable<Stats[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/city`)
      .pipe(catchError(this.handleError));
  }

  getSalariesDatas(): Observable<Datas> {
    return this.http
      .get<any>(`${this.baseUrl}/datas`)
      .pipe(catchError(this.handleError));
  }

  getScore(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/score`);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Une erreur réseau est survenue:', error.error);
    } else {
      console.error(
        `Le serveur a renvoyé le code ${error.status}, ` +
          `corps de la réponse : ${error.error}`
      );
    }

    return throwError(
      () =>
        new Error(
          'Impossible de récupérer les données du serveur. Veuillez réessayer plus tard.'
        )
    );
  }
}
