<template>
  <div id="cpuUsageChart">    
    <apexchart type="line" ref="chart" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

  let data = []
  let count = 11
  function initCharData(count) {
    var i = 0;
    while (i < count) {
      var x = 'hh:mm:ss';
      var y = 0;
      data.push({
        x, y
      });
      i++;
    }
  }
  initCharData(count)
  
  function getNewSeries(xyData) {
    data.push({
      x: xyData.x,
      y: xyData.y
    })
  }
  
  function resetData(){
    data = data.slice(data.length - 20, data.length);
  }
export default {
  name: 'CpuUsageChart',
  props: {
  },
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
  },
  data() {
    return {
      series: [{
        name: "Cpu Usage",
        data: data.slice()
      }],
      chartOptions: {
        chart: {
          id: 'realtime',
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: '',
          range: 10
        },
        yaxis: {
          max: 100,
          min: 0,
          tickAmount: 10,
        },
        legend: {
          show: false
        }
      },
      dataWatch: {}, // cpuUsage watch객체
      resetInterval: {}, // cpuUsage resetInterval객체
    }
  },
  created() {
  },
  mounted() {
    let _self = this
    // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
    this.dataWatch = _self.$store.watch(_self.$store.getters.getCpuUsage, cpuUsage => {
      getNewSeries({x: cpuUsage.x, y: cpuUsage.y} )
      _self.$refs.chart.updateSeries([{
        data: data
      }])
    })
  
    // every 60 seconds, we reset the data to prevent memory leaks
    this.resetInterval = setInterval(function () {
      resetData()
      
      _self.$refs.chart.updateSeries([{
        data
      }], false, true)
    }, 300000)
  },
  beforeDestroy() {
    // watch 제거
    this.dataWatch()
    clearInterval(this.resetInterval);
  },
  methods: {
  },
}
</script>