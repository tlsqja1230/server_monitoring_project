<template>
    <div id="scatterChart">
        <apexchart type="scatter" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'ScatterChart',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
        series: {
            type: Array
        }
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    type: 'scatter',
                    zoom: {
                        type: 'xy'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    xaxis: {
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        lines: {
                            show: true
                        }
                    },
                },
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    max: 2000
                }
            },
      
        }
    },
    methods: {
    },
}
</script>

<style>

</style>