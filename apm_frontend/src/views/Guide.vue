<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg3 sm6 xs12>
        <h1>todo list</h1>
        <v-text-field
          flat
          label="할일 추가"
          v-model="todoVal"
          @keyup.enter="insertTodo()"
        />
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="(item, index) in todoList" :key="index">
                <td>{{ item }}</td>
                <div class="my-2">
                  <v-btn small color="error" @click="deleteTodo(index)">삭제</v-btn>
                </div>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <p>할일 총 {{todoCnt}} 건</p>
      </v-flex>
      <v-flex lg6 sm6 xs12>
        <h1>api test</h1>
        <v-card
          outlined
          class="ma-2 pa-3"
        >
          <div>* http://ec2-15-165-126-152.ap-northeast-2.compute.amazonaws.com:8080{{apiUrl}}</div>
          <v-text-field
            flat
            label="url입력 ex) /api/test"
            style="width:300px;"
            v-model="apiUrl"
          />
          <div class="mt-7">
            * Request JSON
          </div>
          <v-col cols="12" md="12">
            <v-textarea
              solo
              name="input-7-4"
              label='ex) { "name" : "홍길동", "age" : "20" }'
              v-model="apiJson"
            ></v-textarea>
          </v-col>
        </v-card>
        <v-card
          outlined
          class="ma-2"
        >
          <v-list-item>
            <v-list-item-content>
              <div class="overline mb-4">result</div>
              <v-col cols="12" md="12">
                <v-textarea
                  solo
                  name="input-7-4"
                  v-model="apiResult"
                  readonly
                ></v-textarea>
              </v-col>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <div style="margin-top:10px;">
          <v-btn small color="primary" @click="excuteApi()">call api</v-btn>
        </div>
      </v-flex>
      <v-flex lg5 sm6 xs12>
        <h1>socket</h1>
        <v-text-field
          flat
          label="serverURL"
          v-model="serverURL"
        />
        <v-btn small color="primary" @click="socketConnect()">connect socket</v-btn>
        <v-textarea :value="recvList.length > 0? JSON.stringify(recvList) : ''" readonly></v-textarea>
      </v-flex>
      <v-flex lg6 sm6 xs12>
        <h1>apexchart</h1>
        <ScatterChart :series="recvList"></ScatterChart>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ScatterChart from '@/components/common/ScatterChart.vue'
export default {
  name: 'Guide',
  components: {
    ScatterChart
  },
  props: {
  },
  watch: {
  },
  computed: {
    todoCnt(){
      return this.todoList.length
    }
  },
  data(){
    return {
      //todo
      todoList:[],
      todoVal: '',

      //api
      apiUrl: '',
      apiJson: '',
      apiResult: '',

      //socket
      serverURL: 'http://ec2-15-165-126-152.ap-northeast-2.compute.amazonaws.com:8080/websocket',
      recvList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  created() {
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    insertTodo(){
      if(this.todoVal.trim() !== ''){
        this.todoList.push(this.todoVal);
        this.todoVal = '';
      }
    },
    deleteTodo(index){
      this.todoList.splice(index,1);
    },
    async excuteApi(){
      try {
        let param = JSON.parse(this.apiJson)
        await this.$http.post(this.apiUrl, param).then(response=>{
          this.apiResult = response
        })
      } catch (error) {
        this.apiResult = error
      }
    },
    socketConnect() {
      let socket = new this.$sockjs(this.serverURL);
      this.stompClient = this.$webstomp.over(socket);
      this.stompClient.connect(
        {},
        frame => {
          // 소켓 연결 성공
          this.connected = true;
          console.log('소켓 연결 성공', frame);
          // 서버의 메시지 전송 endpoint를 구독합니다.
          // 이런형태를 pub sub 구조라고 합니다.
          this.stompClient.subscribe("/chart", res => {
            console.log('구독으로 받은 메시지 입니다.', res.body);

            // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
            this.recvList.push(JSON.parse(res.body))
          });
        },
        error => {
          // 소켓 연결 실패
          console.log('소켓 연결 실패', error);
          this.connected = false;
        }
      );        
    } 
  },
}
</script>
