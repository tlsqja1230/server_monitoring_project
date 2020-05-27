<template>
  <div id="realTimeLineChart">    
      <apexchart type="line" height="350" ref="chart" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

  var lastDate = 0;
  var data = []
  var TICKINTERVAL = 86400000
  let XAXISRANGE = 777600000
  function getDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
      data.push({
        x, y
      });
      lastDate = baseval
      baseval += TICKINTERVAL;
      i++;
    }
  }
  
  getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
    min: 10,
    max: 90
  })
  
  function getNewSeries(baseval, yrange, xyData) {
    var newDate = baseval + TICKINTERVAL;
    lastDate = newDate
  
    for(var i = 0; i< data.length - 10; i++) {
      data[i].x = newDate - XAXISRANGE - TICKINTERVAL
      data[i].y = 0
    }
  
    data.push({
      x: newDate,
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
  data() {
    return {
      series: [{
        data: data.slice()
      }],
      chartOptions: {
        chart: {
          id: 'realtime',
          height: 350,
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
          type: 'datetime',
          range: 777600000,
        },
        yaxis: {
          max: 100
        },
        legend: {
          show: false
        },
      },
      socket: this.$store.state.socket
    }
  },
  created() {
    debugger
    let _self = this
    //this.socket.emit('cpuPercentage',{})
    this.socket.on('cpuPercentage', function(res){
      // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
      console.log(res.cpuPercentage)
      getNewSeries(lastDate, {
        min: 0,
        max: 100
      },{x: '1732128', y: res.cpuPercentage} )
      // {x: "1732128", y: "30"}
      _self.$refs.chart.updateSeries([{
        data: data
      }])
    });
  },
  mounted() {
    var me = this
    // window.setInterval(function () {
    //   getNewSeries(lastDate, {
    //     min: 10,
    //     max: 90
    //   })
      
    //   me.$refs.chart.updateSeries([{
    //     data: data
    //   }])
    // }, 1000)
  
    // every 60 seconds, we reset the data to prevent memory leaks
    window.setInterval(function () {
      resetData()
      
      me.$refs.chart.updateSeries([{
        data
      }], false, true)
    }, 60000)
  },
}
</script>