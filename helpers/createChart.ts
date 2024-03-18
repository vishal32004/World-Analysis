import { ChartValues } from "@/types";
import { PieChart } from "./charts/pieChart";
export const CreateChart = <T extends Record<string, any>, X extends string, Y extends string, Prefix extends string>(
    data: T[],
    values: ChartValues<X, Y, Prefix>
) => {


    if (values.chartType === 'pie' || 'donut') {
        const options = PieChart(data, values)
        return options
    }


    const xValues = data.map((entry) => entry[values.xValueKey]);
    const seriesData = values.yValueKeys.map((key) => {
        const newKey = values.prefix + '_' + key
        return {
            name: key.replace(values.prefix, "").replace("_", " ").toUpperCase(),
            data: data.map((entry) => parseInt(entry[newKey].toString())),
        };
    });

    const options = {
        chart: {
            type: values.chartType,
        },
        title: {
            text: values.chartTitle,
            align: "left",
        },
        xAxis: {
            title: {
                text: values.xAxisLabel,
            },
            categories: xValues,
        },
        yAxis: {
            title: {
                text: values.yAxisLabel,
            },
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "middle",
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
            },
        },
        series: seriesData,
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            layout: "horizontal",
                            align: "center",
                            verticalAlign: "bottom",
                        },
                    },
                },
            ],
        },
        credits: {
            enabled: false,
        },
    };



    return options;
};
