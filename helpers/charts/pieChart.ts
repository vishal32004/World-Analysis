import { ChartValues } from "@/types";
interface DataObject {
    [key: string]: any;
}

interface PieChartData {
    name: string;
    y: number;
}

function convertDataForPieChart(data: DataObject[]): PieChartData[] {
    const pieChartDataMap: Map<string, number> = new Map();
    data.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (key.toLowerCase() !== 'year' && key.toLowerCase() !== 'month' && !isNaN(parseFloat(obj[key]))) {
                const name = key.toUpperCase().replace('_', ' ');
                const value = parseFloat(obj[key]);
                if (pieChartDataMap.has(name)) {
                    const currentY = pieChartDataMap.get(name) || 0;
                    pieChartDataMap.set(name, currentY + value);
                } else {
                    pieChartDataMap.set(name, value);
                }
            }
        });
    });
    const pieChartData: PieChartData[] = Array.from(pieChartDataMap, ([name, y]) => ({ name, y }));
    return pieChartData;
}

export const PieChart = <T extends Record<string, any>, X extends string, Y extends string, Prefix extends string>(
    data: T[],
    values: ChartValues<X, Y, Prefix>
) => {


    let chartType = values.chartType;
    let chartOptions = {}
    let is3d = false
    if (values.chartType.startsWith('3d')) {
        chartType = values.chartType.replace('3d-', '');
        is3d = true
        alert(chartType)
        chartOptions = {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        };
    } else {
        chartOptions = {
            type: 'pie'
        };
    }
    const pieOptions = convertDataForPieChart(data);
    const isDonut = chartType === 'donut';
    const isHalfDonut = chartType === 'half-donut';
    const plotOptions: any = {
        series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
                enabled: true,
                distance: 20
            }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: {
                    fontSize: '1.2em',
                    textOutline: 'none',
                    opacity: 0.7
                },
                filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                }
            }]
        }
    };
    if (isDonut || isHalfDonut) {
        plotOptions.series.innerSize = '50%';
        if (isHalfDonut) {
            plotOptions.series.startAngle = -90;
            plotOptions.series.endAngle = 90;
        }
    }
    const pieObj = {
        chart: chartOptions,
        colors: values.colors,
        title: {
            text: values.chartTitle,
        },
        plotOptions: plotOptions,
        series: [
            {
                name: 'Data',
                colorByPoint: true,
                data: pieOptions
            }
        ]
    };
    return {
        options: pieObj,
        filters: [],
        is3D: is3d
    };
};
