<template>
  <div class="container">

    <div class="filters">
      <label for="pet">Питомец:</label>
      <select v-model="selectedPet" @change="fetchData">
        <option v-for="pet in pets" :key="pet.id" :value="pet.id">
          {{ pet.name }}
        </option>
      </select>

      <label for="filter">Фильтр:</label>
      <select v-model="filter" @change="fetchData">
        <option value="day">За прошедший день</option>
        <option value="week">За 7 дней</option>
        <option value="month">За 30 дней</option>
      </select>
    </div>
    <ul v-for="message in messages">
        <li>{{ message }}</li>
    </ul>
    <h3>Статистика кормления</h3>
    <BarChart :chart-data="eatingChartData" />
    <h3 style="margin-top: 40px;">Статистика посещения лотка</h3>
    <BarChart :chart-data="litterChartData" />
    <h3 style="margin-top: 40px;">Статистика шагов</h3>
    <BarChart :chart-data="collarChartData" />
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const BarChart = defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  template: `
    <div>
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  `
})

export default {
  name: 'FeedingChart',
  components: {
    BarChart
  },
data() {
  return {
    pets: [],
    selectedPet: null,
    filter: 'day',
    messages: [],
    eatingChartData: {
      labels: [],
      datasets: [
        {
          label: 'Размер порции',
          backgroundColor: '#42A5F5',
          data: []
        }
      ]
    },
    litterChartData: {
      labels: [],
      datasets: [
        {
          label: 'Количество посещений',
          backgroundColor: '#66BB6A',
          data: []
        }
      ]
    },
    collarChartData: {
      labels: [],
      datasets: [
        {
          label: 'Количество шагов',
          backgroundColor: '#FFA726',
          data: []
        }
      ]
    }
  }
},
  methods: {
    async fetchPets() {
      try {
        const response = await axios.post('http://localhost:8000/pet/get_pets_by_user', {
          access_token: localStorage.getItem('token'),
          token_type: 'bearer'
        })
        this.pets = response.data
        if (this.pets.length > 0) {
          this.selectedpet = this.pets[0].id
          this.fetchData()
        }
      } catch (error) {
        console.error('Ошибка при получении животных:', error)
      }
    },

    getLabels(data) {
      console.log(data)
      return data.map(item => {
        if (item.day) {
          return new Date(item.day).toLocaleDateString(); 
        }
        else {
          return 'Неизвестно'; 
        }
      });
    },

    getSizes(data) {
      return data.map(item => {
        return item.size || 0; 
      });
    },
getCounts(data) {
  return data.map(item => item.count || 1); 
},
async fetchData() {
  if (!this.selectedPet) return;
  try {
    const eatingResponse = await axios.post('http://localhost:8000/analitic/get_eating_activity', {
      pet_id: this.selectedPet,
      type: this.filter
    });
    const eatingData = eatingResponse.data;

    this.eatingChartData = {
      labels: this.getLabels(eatingData),
      datasets: [
        {
          label: 'Размер порции',
          backgroundColor: '#42A5F5',
          data: this.getSizes(eatingData)
        }
      ]
    };

    const litterResponse = await axios.post('http://localhost:8000/analitic/get_litter_clean_activity', {
      pet_id: this.selectedPet,
      type: this.filter
    });
    const litterData = litterResponse.data;

    this.litterChartData = {
      labels: this.getLabels(litterData),
      datasets: [
        {
          label: 'Количество посещений',
          backgroundColor: '#66BB6A',
          data: this.getCounts(litterData)
        }
      ]
    };
    const collarResponse = await axios.post('http://localhost:8000/analitic/get_collar_activity', {
      pet_id: this.selectedPet,
      type: this.filter
    });
    const collarData = collarResponse.data;
    this.collarChartData = {
      labels: this.getLabels(collarData),
      datasets: [
        {
          label: 'Количество шагов',
          backgroundColor: '#FFA726',
          data: this.getCounts(collarData)
        }
      ]
    };
    const messegesResponse = await axios.post('http://localhost:8000/analitic/check_references', {
      pet_id: this.selectedPet,
      type: this.filter
    });
    this.messages = messegesResponse.data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
},
  },
  mounted() {
    this.fetchPets()
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

select {
  padding: 8px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

canvas {
  height: 400px !important;
}
</style>
