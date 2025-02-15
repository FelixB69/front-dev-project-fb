import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SalaryService } from '../../core/services/salary.service';
import { ToastService } from '../../core/services/toast.service'; // Import du service Toast
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';
import { Datas, Stats } from '../../core/models/salary.model';
import { CITIES, RANGES, YEARS } from '../../core/constants/salaryConstants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public chart: any;
  stats: { title: string; value: string | number; valueColor: string }[] = [];

  constructor(
    private salaryService: SalaryService,
    private toastService: ToastService // Injection du service Toast
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadSalaryRanges();
    this.loadSalaryData();
    this.loadSalaryYears();
    this.loadSalaryCity();
  }

  loadSalaryRanges(): void {
    this.salaryService.getSalariesRanges().subscribe({
      next: (ranges) => {
        this.createChart(ranges, 'rangeChart', RANGES);
        this.createLineChart(ranges, 'rangeLineChart');
      },
      error: (err) => {
        this.toastService.error(
          'Erreur lors du chargement des tranches de salaires'
        );
        console.error(
          'Erreur lors du chargement des tranches de salaires:',
          err
        );
      },
    });
  }

  loadSalaryYears(): void {
    this.salaryService.getSalariesYears().subscribe({
      next: (years) => {
        this.createChart(years, 'yearChart', YEARS);
        this.createLineChart(years, 'yearLineChart');
      },
      error: (err) => {
        this.toastService.error(
          'Erreur lors du chargement des années de salaires'
        );
        console.error('Erreur lors du chargement des années de salaires:', err);
      },
    });
  }

  loadSalaryCity(): void {
    this.salaryService.getSalariesCity().subscribe({
      next: (city) => {
        this.createChart(city, 'cityChart', CITIES);
        this.createBarChart(city);
      },
      error: (err) => {
        this.toastService.error(
          'Erreur lors du chargement des données des villes'
        );
        console.error('Erreur lors du chargement des données des villes:', err);
      },
    });
  }

  loadSalaryData(): void {
    this.salaryService.getSalariesDatas().subscribe({
      next: (data: Datas) => {
        this.stats = [
          {
            title: 'Total des Salaires',
            value: data.totalSalaries,
            valueColor: 'text-pink',
          },
          {
            title: 'Salaire Moyen',
            value: `${data.averageCompensation} €`,
            valueColor: 'text-green',
          },
          {
            title: 'Salaire Médian',
            value: `${data.medianCompensation} €`,
            valueColor: 'text-orange',
          },
          {
            title: 'Salaire Min',
            value: `${data.lowestSalary} €`,
            valueColor: 'text-blue',
          },
          {
            title: 'Salaire Max',
            value: `${data.highestSalary} €`,
            valueColor: 'text-gray',
          },
        ];
      },
      error: (err) => {
        this.toastService.error(
          'Erreur lors du chargement des données des salaires'
        );
        console.error(
          'Erreur lors du chargement des données des salaires:',
          err
        );
      },
    });
  }

  createChart(datas: Stats[], chartName: string, constant: any): void {
    const labels = constant.map((data: any) => data.label);
    const data = datas.map((data) => data.percentage);
    const averages = datas.map((data) => data.average);
    const count = datas.map((data) => data.count);

    this.chart = new Chart(chartName, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#26547C',
              '#EF476F',
              '#FFD166',
              '#06D6A0',
              '#273444',
              '#8492a6',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              useBorderRadius: true,
              borderRadius: 5,
            },
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItem) {
                return constant[tooltipItem[0].dataIndex].label;
              },
              label: function (tooltipItem) {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex];
                const average = averages[tooltipItem.dataIndex];
                const counts = count[tooltipItem.dataIndex];
                return ` ${counts} - ${value}% (Moyenne: ${average}€)`;
              },
            },
          },
        },
      },
    });
  }

  createBarChart(data: any[]): void {
    const labels = CITIES.map((item) => item.label);
    const salaries = data.map((item) => item.average);
    const medianSalaries = data.map((item) => item.median);

    new Chart('barCities', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Salaire Moyen (€)',
            data: salaries,
            borderColor: '#06D6A0',
            backgroundColor: 'rgba(6, 214, 160, 0.2)',
            borderWidth: 1,
          },
          {
            label: 'Salaire Médian (€)',
            data: medianSalaries,
            borderColor: '#FFD166',
            backgroundColor: 'rgba(255, 209, 102, 0.2)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const dataset = tooltipItem.dataset;
                const value = dataset.data[tooltipItem.dataIndex];
                return `${dataset.label}: ${value}€ `;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createLineChart(data: any[], chartName: string): void {
    const labels = YEARS.map((item) => item.label);
    const averageSalaries = data.map((item) => item.average);
    const medianSalaries = data.map((item) => item.median);

    new Chart(chartName, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Salaire Moyen (€)',
            data: averageSalaries,
            borderColor: '#06D6A0',
            backgroundColor: 'rgba(6, 214, 160, 0.2)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Salaire Médian (€)',
            data: medianSalaries,
            borderColor: '#FFD166',
            backgroundColor: 'rgba(255, 209, 102, 0.2)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} €`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tranches de salaire',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Montant (€)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}
