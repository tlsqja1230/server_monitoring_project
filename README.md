# server_monitoring_project
서버 모니터링 프로젝트

## 기술스택

Frontend :

- Vue.js
- Vuetify.js(ui framework)
- apexcharts
- socket.io

Backend :

- Node.js
- Express
- socket.io
- node-os-utils

## 프로젝트 설명

해당 웹서버의 cpu, memory, drive, processCount 등의 실시간 데이터를 소켓통신을 사용하여 다양한 차트로 시각화해주는 프로젝트

- cpuUsage(line chart)
- memory percent(gauge chart)
- memory Space(area chart)
- drive percent(radialBal chart)
- drive Space(bar chart)
- process Count(line chart)


테스트서버(google cloud platform) url - http://34.64.151.146/