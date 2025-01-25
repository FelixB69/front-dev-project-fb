import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Salary, Score } from '../../models/salary.model';
import { SalaryService } from '../../services/salary/salary.service';
import { FormsModule } from '@angular/forms';
import { RANGES, YEARS } from '../../core/constants/salaryConstants';

@Component({
  selector: 'app-salaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css',
  providers: [],
})
export class SalaryComponent implements OnInit {
  salaries: Salary[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  score: Score[] = [];
  selectedCity: string = '';
  selectedRangeName: string = '';
  selectedYear: string = '';
  cities: string[] = [];
  ranges: { name: string; label: string }[] = RANGES;
  year: { name: string; label: string }[] = YEARS;
  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.fetchSalaries();
    this.fetchCities();
    this.fetchScore();
  }

  fetchSalaries(): void {
    this.loading = true;
    this.errorMessage = '';

    this.salaryService
      .getSalariesWithFilters(
        this.selectedCity,
        this.selectedRangeName,
        this.selectedYear
      )
      .subscribe({
        next: (data) => {
          this.salaries = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des salaires.';
          this.loading = false;
          console.error(error);
        },
        complete: () => {
          console.log('Récupération des salaires terminée.');
        },
      });
  }

  fetchCities() {
    this.salaryService.getCities().subscribe((cities) => {
      this.cities = cities;
    });
  }

  fetchScore() {
    this.salaryService.getScore().subscribe((score) => {
      this.score = score;
    });
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.fetchSalaries();
  }

  filterByRange(rangeName: string): void {
    this.selectedRangeName = rangeName;
    this.fetchSalaries();
  }

  filterByYear(year: string): void {
    this.selectedYear = year;
    this.fetchSalaries();
  }

  sortData(key: string): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }

    this.salaries.sort((a: any, b: any) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }

  getScoreById(itemId: string): string | number {
    console.log('SCORE', this.score);
    const scoreEntry = this.score.find((score) => score.id === itemId);
    console.log(
      '🚀 ~ SalaryComponent ~ getScoreById ~ scoreEntry:',
      scoreEntry,
      itemId
    );
    return scoreEntry?.score || 'N/A';
  }
}
