<template>
  <div id="realTimeLineChart">    
      <apexchart type="line" ref="chart" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

  //var lastDate = 0;
  var data = []
  //var TICKINTERVAL = 86400000
  //let XAXISRANGE = 777600000
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
  
  initCharData(11)
  
  function getNewSeries(xyData) {
    data.push({
      x: xyData.x,
      y: xyData.y
    })
  }
  
  function resetData(){
    data = data.slice(data.length - 10, data.length);
  }
export default {
  name: 'RealTimeLineChart',
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
          text: 'Dynamic Updating Chart',
          align: 'left'
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
        },
      },
      dataWatch: {}, // cpuPerData watch객체
      resetInterval: {}, // cpuPerData resetInterval객체
    }
  },
  created() {
  },
  mounted() {
    let _self = this
    // watch를 사용하여 store의 chart데이터가 변경될때를 감지하여 chart update를 한다.
    this.dataWatch = _self.$store.watch(_self.$store.getters.getCpuPerData, cpuPerData => {
      getNewSeries({x: cpuPerData.x, y: cpuPerData.y} )
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
    }, 60000)
  },
  methods: {
  },
  beforeDestroy() {
    // watch 제거
    this.dataWatch()
    clearInterval(this.resetInterval);
  },
}
</script>