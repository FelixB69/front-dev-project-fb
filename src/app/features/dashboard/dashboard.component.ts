import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SalaryService } from '../../services/salary/salary.service';
import { StatsCardComponent } from '../../shared/stats-card/stats-card.component';
import { Datas, Stats } from '../../models/salary.model';
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

  constructor(private salaryService: SalaryService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadSalaryRanges();
    this.loadSalaryData();
    this.loadSalaryYears();
    this.loadSalaryCity();
  }

  loadSalaryRanges(): void {
    this.salaryService.getSalariesRanges().subscribe((ranges) => {
      this.createChart(ranges, 'rangeChart', RANGES);
    });
  }

  loadSalaryYears(): void {
    this.salaryService.getSalariesYears().subscribe((years) => {
      this.createChart(years, 'yearChart', YEARS);
    });
  }

  loadSalaryCity(): void {
    this.salaryService.getSalariesCity().subscribe((city) => {
      this.createChart(city, 'cityChart', CITIES);
    });
  }

  loadSalaryData(): void {
    this.salaryService.getSalariesDatas().subscribe((data: Datas) => {
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
          valueColor: 'text-grey',
        },
      ];
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

  formatRangeName(name: string): string {
    switch (name) {
      case 'under30k':
        return 'Moins de 30k';
      case 'between30kAnd40k':
        return '30k - 40k';
      case 'between40kAnd50k':
        return '40k - 50k';
      case 'between50kAnd70k':
        return '50k - 70k';
      case 'between70kAnd100k':
        return '70k - 100k';
      case 'over100k':
        return 'Plus de 100k';
      default:
        return name;
    }
  }
}
