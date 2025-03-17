<template>
<div>
      <h3>Кормушки  
      <button class="btn btn-danger btn-sm" @click="showModalFeeder()">Новая кормушка</button>
      <button class="btn btn-danger btn-sm" @click="showModalFeederCollar()">Новый ошейник</button>
      <button class="btn btn-danger btn-sm" @click="showModalSettings()">Настроить кормушку</button>
      </h3>
        <modal-window ref="modal_feeder">
            <template v-slot:title>
                <h3 class="modal-title">Добавить кормушку</h3>
            </template>
            <template v-slot:footer>
                <input v-model="name" placeholder="Имя" />
                <button class="modal-footer__button" @click="addFeeder()">Отправить</button>
            </template>
        </modal-window>
        <modal-window ref="modal_feeder_collar">
            <template v-slot:title>
                <h3 class="modal-title">Добавить ошейник</h3>
            </template>
            <template v-slot:footer>
              <select v-model="feeder_name">
                <option v-for="feeder in feeders" v-bind:value="feeder">{{ feeder.name }}</option>
              </select>
              <input v-model="name" placeholder="Имя" />
              <button class="modal-footer__button" @click="addCollar('feeder', feeder_name.id)">Отправить</button>
            </template>
        </modal-window>
        <modal-window ref="modal_settings">
            <template v-slot:title>
                <h3 class="modal-title">Настройки</h3>
            </template>
            <template v-slot:footer>
              <select v-model="settings_list" @change="showChange">
                <option v-for="feeder in feeders" v-bind:value="feeder" >{{ feeder.name }}</option>
              </select>
              <span>Размер порции</span><input v-model="size"/>
              <span>Часовой пояс</span><input v-model="timezone"/>
              <span>Расписание</span><input v-model="schedule"/>
              <button class="modal-footer__button">Отправить</button>
            </template>
        </modal-window>
        <ul class="list-group mt-4">
        <li v-for="feeder in feeders" :key="feeder.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            {{ feeder.name }}
          </span>
          <button @click="deleteFeeder(feeder.id)" class="btn btn-danger btn-sm">✖️</button>
        <ul class="list-group mt-4">
          <li v-for="collar in feeder.collars" :key="collar.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            {{ collar.name }}
          </span>
          <button @click="deleteCollar(collar.id, 'feeder')" class="btn btn-danger btn-sm">✖️</button>
        </li>
      </ul>
        </li>
      </ul>
      
</div>

<div>
      <h3>Лотки <button class="btn btn-danger btn-sm" @click="showModalLitter()">Новый лоток</button>
      <button class="btn btn-danger btn-sm" @click="showModalLitterCollar()">Новый ошейник</button>
      </h3>
          <modal-window ref="modal_litter">
            <template v-slot:title>
                <h3 class="modal-title">Добавить лоток</h3>
            </template>
            <template v-slot:footer>
                <input v-model="name" placeholder="Имя" />
                <button class="modal-footer__button" @click="addLitter()">Отправить</button>
            </template>
        </modal-window>
        <modal-window ref="modal_litter_collar">
            <template v-slot:title>
                <h3 class="modal-title">Добавить ошейник</h3>
            </template>
            <template v-slot:footer>
              <select v-model="litter_name">
                <option v-for="litter in litters" v-bind:value="litter">{{ litter.name }}</option>
              </select>
              <input v-model="name" placeholder="Имя" />
              <button class="modal-footer__button" @click="addCollar('litter', litter_name.id)">Отправить</button>
            </template>
        </modal-window>
        <ul class="list-group mt-4">
          <li v-for="litter in litters" :key="litter.id" class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {{ litter.name }}
            </span>
            <button @click="deleteLitter(litter.id)" class="btn btn-danger btn-sm">✖️</button>
                    <ul class="list-group mt-4">
          <li v-for="collar in litter.collars" :key="collar.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            {{ collar.name }}
          </span>
          <button @click="deleteCollar(collar.id, 'litter')" class="btn btn-danger btn-sm">✖️</button>
        </li>
      </ul>
          </li>
        </ul>
        
</div>
</template>

<script>
import axios from "axios";
import ModalWindow from './modal-window.vue'
export default {
  name: "Home",
  components: {
            ModalWindow
        },
  data() {
    return {
      name: '',
      feeder_name: {},
      litter_name: {},
      settings_list: {},
      size: 0,
      timezone: 0,
      schedule: [],
      feeders: [],
      litters: [],
    };
  },
  methods: {
    showChange(event) {
      this.size = this.settings_list.size
      this.timezone = this.settings_list.timezone
      this.schedule = this.settings_list.schedule
    },
    async showModalFeeder() {
                this.$refs.modal_feeder.show = true
            },
    async showModalLitter() {
                this.$refs.modal_litter.show = true
            },
    async showModalFeederCollar() {
                this.$refs.modal_feeder_collar.show = true
            },
    async showModalLitterCollar() {
                this.$refs.modal_litter_collar.show = true
            },
    async showModalSettings() {
                this.$refs.modal_settings.show = true
            },
    async getFeeders() {
      const response = await axios.post("http://localhost:8000/feeder/get_feeders_by_user",
      {
        id: 1
      });
      console.log(response.data);
      this.feeders = response.data;
    },
    async getLitters() {
      const response = await axios.post("http://localhost:8000/litter/get_litters_by_user",
      {
        id: 1
      });
      console.log(response.data);
      this.litters = response.data;
    },
  async deleteFeeder(feeder_id) {
  try {
    console.log(feeder_id);
    await axios.delete(`http://localhost:8000/feeder/delete_feeder/${feeder_id}`);
    this.feeders = this.feeders.filter(feeder => feeder.id !== feeder_id);
  } catch (error) {
    console.log(error);
  }
  },
  async deleteLitter(litter_id) {
  try {
    console.log(litter_id);
    await axios.delete(`http://localhost:8000/litter/delete_litter/${litter_id}`);
    this.litters = this.litters.filter(litter => litter.id !== litter_id);
  } catch (error) {
    console.log(error);
  }
  },
  async deleteCollar(collar_id, device_type) {
  try {
    console.log(collar_id);
    await axios.delete(`http://localhost:8000/collar/delete_collar/${collar_id}`);
    if (device_type == 'feeder'){
      this.feeders.forEach(feeder => (feeder.collars = feeder.collars.filter(collar => collar.id != collar_id)));
    }
    else if (device_type == 'litter'){
      this.litters.forEach(litter => (litter.collars = litter.collars.filter(collar => collar.id != collar_id)));
    }
  } catch (error) {
    console.log(error);
  }
  },
  async addCollar(device_type, device_id) {
  try {
    console.log(device_type, device_id);
    await axios.post('http://localhost:8000/collar/add_collar', {
      name: this.name,
      device_id: device_id,
      device_type: device_type
    });
    
  this.name = "";
  } catch (error) {
    console.log(error);
  }
  },
  async addFeeder() {
        try {
          console.log(this.name);
          const response = await axios.post('http://localhost:8000/feeder/add_feeder', {
            name: this.name,
            user_id: 1
          });
    this.feeders.push(response.data);
    this.name = "";
        } catch (error) {
          console.error(error);
        }
      },

  async addLitter() {
        try {
          console.log(this.name);
          const response = await axios.post('http://localhost:8000/litter/add_litter', {
            name: this.name,
            user_id: 1
          });
    this.litters.push(response.data);
    this.name = "";
        } catch (error) {
          console.error(error);
        }
      },
  },
  beforeMount() {
    this.getFeeders();
    this.getLitters();
  },
};
</script>
