<template>

<h3>Добро пожаловать, {{ this.username }}</h3>
      <button class="btn btn-danger btn-sm" @click="showModalCharts()">Аналитика</button>
    <modal-window ref="modal_charts">
          <template v-slot:footer>

      <BarChart />
      </template>
    </modal-window>
  <div class="container">
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
        <input v-model="name" placeholder="Имя" class="input-field"/>
        <button class="modal-footer__button" @click="addFeeder()">Отправить</button>
      </template>
    </modal-window>
    
    <modal-window ref="modal_feeder_collar">
      <template v-slot:title>
        <h3 class="modal-title">Добавить ошейник</h3>
      </template>
      <template v-slot:footer>
        <select v-model="feeder_name" class="input-field">
          <option v-for="feeder in feeders" v-bind:value="feeder">{{ feeder.name }}</option>
        </select>
        <input v-model="name" placeholder="Ошейник" class="input-field"/>
        <input v-model="pet_name" placeholder="Имя питомца" class="input-field"/>
        <input type="radio" id="m" value="M" v-model="gender" />
        <label for="m">Самец</label>
        <input type="radio" id="f" value="F" v-model="gender" />
        <label for="f">Самка</label>
        <input type="checkbox" id="checkbox" v-model="kitten" />
        <label for="kitten">Котёнок</label>
        <div v-if="!kitten">
          <input v-model="weight" placeholder="Вес" class="input-field"/>
          <input type="checkbox" id="checkbox" v-model="pregnant" />
          <label for="pregnant">Беременность</label>
          <input type="checkbox" id="checkbox" v-model="sterilized" />
          <label for="sterilized">Стерилизация</label>
        </div>
        <button class="modal-footer__button" @click="addCollar('feeder', feeder_name.id)">Отправить</button>
      </template>
    </modal-window>
    
    <modal-window ref="modal_settings">
      <template v-slot:title>
        <h3 class="modal-title">Настройки</h3>
      </template>
      <template v-slot:footer>
        <select v-model="settings_list" @change="getSettingsByFeeder" class="input-field">
          <option v-for="feeder in feeders" v-bind:value="feeder">{{ feeder.name }}</option>
        </select>
        <span>Размер порции</span><input v-model="size" class="input-field"/>
        <span>Часовой пояс</span><input v-model="timezone" class="input-field"/>
        <span>Расписание</span><button @click="addTime()" class="btn btn-sm btn-primary">+</button>
        
        <div v-for="(schedule_item, index) in schedule" :key="index" class="nested-list">
          <div v-for="(item, item_index) in schedule_item" :key="item_index">
            <input v-model="schedule_item[item_index]" class="input-field">
          </div>
          <button @click="deleteTime(index)" class="btn btn-sm btn-danger">-</button>
        </div>
        
        <button class="modal-footer__button" @click="updateSettings(settings_list.id)">Отправить</button>
      </template>
    </modal-window>

    <ul class="list-group mt-4">
      <li v-for="feeder in feeders" :key="feeder.id" class="list-group-item">
        <div class="device-header">
          <span>{{ feeder.name }}</span>
          <button @click="deleteFeeder(feeder.id)" class="btn btn-danger btn-sm">✖️</button>
        </div>
        <ul class="nested-list">
          <li v-for="collar in feeder.collars" :key="collar.id" class="list-group-item nested-item">
            <span>{{ collar.name }}</span>
            <button @click="deleteCollar(collar.id, 'feeder')" class="btn btn-danger btn-sm">Настройки</button>
            <button @click="deleteCollar(collar.id, 'feeder')" class="btn btn-danger btn-sm">✖️</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <div class="container">
    <h3>Лотки 
      <button class="btn btn-danger btn-sm" @click="showModalLitter()">Новый лоток</button>
      <button class="btn btn-danger btn-sm" @click="showModalLitterCollar()">Новый ошейник</button>
    </h3>

    <modal-window ref="modal_litter">
      <template v-slot:title>
        <h3 class="modal-title">Добавить лоток</h3>
      </template>
      <template v-slot:footer>
        <input v-model="name" placeholder="Имя" class="input-field"/>
        <button class="modal-footer__button" @click="addLitter()">Отправить</button>
      </template>
    </modal-window>
    
    <modal-window ref="modal_litter_collar">
      <template v-slot:title>
        <h3 class="modal-title">Добавить ошейник</h3>
      </template>
      <template v-slot:footer>
        <select v-model="litter_name" class="input-field">
          <option v-for="litter in litters" v-bind:value="litter">{{ litter.name }}</option>
        </select>
        <input v-model="pet_name" placeholder="Имя питомца" class="input-field"/>
        <input type="radio" id="cat" value="cat" v-model="type" />
        <label for="m">Кошка</label>
        <input type="radio" id="dog" value="dog" v-model="type" />
        <label for="f">Собака</label>
        <input type="radio" id="m" value="M" v-model="gender" />
        <label for="m">Самец</label>
        <input type="radio" id="f" value="F" v-model="gender" />
        <label for="f">Самка</label>
        <input type="checkbox" id="checkbox" v-model="kitten" />
        <label for="kitten">Котёнок</label>
        <div v-if="!kitten">
          <input v-model="weight" placeholder="Вес" class="input-field"/>
          <input type="checkbox" id="checkbox" v-model="pregnant" />
          <label for="pregnant">Беременность</label>
          <input type="checkbox" id="checkbox" v-model="sterilized" />
          <label for="sterilized">Стерилизация</label>
        </div>
        <button class="modal-footer__button" @click="addCollar('litter', litter_name.id)">Отправить</button>
      </template>
    </modal-window>

    <ul class="list-group mt-4">
      <li v-for="litter in litters" :key="litter.id" class="list-group-item">
        <div class="device-header">
          <span>{{ litter.name }}</span>
          <button @click="deleteLitter(litter.id)" class="btn btn-danger btn-sm">✖️</button>
        </div>
        <ul class="nested-list">
          <li v-for="collar in litter.collars" :key="collar.id" class="list-group-item nested-item">
            <span>{{ collar.name }}</span>
            <button @click="deleteCollar(collar.id, 'litter')" class="btn btn-danger btn-sm">✖️</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  
</template>

<style scoped>
div, header, p, h1, h2, h3 {
  font-family: "PT Sans", "Arial", sans-serif;
}

.container {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #333;
}

.modal-footer__button {
  width: 100%;
  padding: 10px;
  background-color: #a9bdb9;
  color: #2c3e50;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.modal-footer__button:hover {
  background-color:rgb(127, 145, 141);
}

.list-group {
  margin-top: 10px;
  padding: 0;
}

.list-group-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nested-list {
  margin-top: 5px;
  padding-left: 20px;
}

.nested-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #f1f1f1;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>

<script>
import axios from "axios";
import BarChart from './Analitic.vue'
import ModalWindow from './Modal.vue'
export default {    
  name: "Home",
  components: {
            BarChart,
            ModalWindow
        },
  data() {
    return {
      username: localStorage.getItem('name'),
      name: '',
      pet_name: '',
      gender: '',
      child: true,
      type: '',
      pregnant: false,
      sterilized: false,
      weight: 0,
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
    fullPetList(event) {
      this.$refs.full_pet_list.show = false
    },
    getSettingsByFeeder(event) {
      //console.log(this.settings_list)
      this.size = this.settings_list.size
      this.timezone = this.settings_list.timezone
      this.schedule = this.settings_list.schedule
    },
    async addTime() {
                this.schedule.push([0, 0])
                console.log(this.schedule)
            },
    async deleteTime(index) {
                this.schedule.splice(index, 1)
                
                console.log(this.schedule)
            },
    async showModalCharts() {
                this.$refs.modal_charts.show = true
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
        access_token: localStorage.getItem('token'),
        token_type: "bearer"
      });
      console.log(response.data);
      this.feeders = response.data;
    },
    async getLitters() {
      const response = await axios.post("http://localhost:8000/litter/get_litters_by_user",
      {
        access_token: localStorage.getItem('token'),
        token_type: "bearer"
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
      device_type: device_type,
      access_token: localStorage.getItem('token'),
      token_type: "bearer",
      type: this.type
      pet_name: this.pet_name,
      gender: this.gender,
      child: this.kitten,
      pregnant: this.pregnant,
      sterilized: this.sterilized,
      weight: this.weight,      
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
            access_token: localStorage.getItem('token'),
            token_type: "bearer"
          });
    this.feeders.push(response.data);
    this.name = "";
        } catch (error) {
          console.error(error);
        }
      },
  async updateSettings(feeder_id) {
        try {
          console.log(feeder_id, parseInt(this.size), this.schedule, parseInt(this.timezone))
          const response = await axios.post('http://localhost:8000/settings/update_settings', {
          "id": feeder_id,
          "size": parseInt(this.size),
          "schedule": this.schedule,
          "timezone": parseInt(this.timezone)
          });
          this.feeders.forEach((feeder, index) => {
            if(feeder.id == feeder_id){
              feeder.schedule = this.schedule
              feeder.size = this.size
              feeder.timezone = this.timezone
            }
          })
        } catch (error) {
          console.error(error);
        }
      },
  async addLitter() {
        try {
          console.log(this.name);
          const response = await axios.post('http://localhost:8000/litter/add_litter', {
            name: this.name,
            access_token: localStorage.getItem('token'),
            token_type: "bearer"
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

