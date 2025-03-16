<template>
      <h3>Кормушки  <button class="btn btn-danger btn-sm" @click="showModalFeeder()">➕</button></h3>
        <modal-window ref="modal_feeder">
            <template v-slot:title>
                <h3 class="modal-title">Добавить кормушку</h3>
            </template>
            <template v-slot:footer>
                <input v-model="name" placeholder="Имя" />
                <button class="modal-footer__button" @click="addFeeder()">Отправить</button>
            </template>
        </modal-window>
        <ul class="list-group mt-4">
        <li v-for="feeder in feeders" :key="feeder.id" class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            {{ feeder.name }}
          </span>
          <button class="btn btn-danger btn-sm">➕</button>
          <button class="btn btn-danger btn-sm">✏️</button>
          <button @click="deleteFeeder(feeder.id)" class="btn btn-danger btn-sm">✖️</button>
        </li>
      </ul>
      <h3>Лотки <button class="btn btn-danger btn-sm" @click="showModalLitter()">➕</button></h3>
          <modal-window ref="modal_litter">
            <template v-slot:title>
                <h3 class="modal-title">Добавить лоток</h3>
            </template>
            <template v-slot:footer>
                <input v-model="name" placeholder="Имя" />
                <button class="modal-footer__button" @click="addLitter()">Отправить</button>
            </template>
        </modal-window>
        <ul class="list-group mt-4">
          <li v-for="litter in litters" :key="litter.id" class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {{ litter.name }}
            </span>
            <button class="btn btn-danger btn-sm">➕</button>
            <button @click="deleteLitter(litter.id)" class="btn btn-danger btn-sm">✖️</button>
          </li>
        </ul>
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
      feeders: [],
      litters: [],
    };
  },
  methods: {
    async showModalFeeder() {
                this.$refs.modal_feeder.show = true
            },
    async showModalLitter() {
                this.$refs.modal_litter.show = true
            },
    async getFeeders() {
      const { data } = await axios.get("http://localhost:8000/feeder/feeders_all");
      this.feeders = data;
    },
    async getLitters() {
      const { data } = await axios.get("http://localhost:8000/litter/litters_all");
      this.litters = data;
      console.log(data);
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
