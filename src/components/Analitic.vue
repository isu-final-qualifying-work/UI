<template>
  <div class="container">
    <h3>Статистика кормления</h3>

    <div class="filters">
      <label for="collar">Питомец:</label>
      <select v-model="selectedCollar" @change="fetchData">
        <option v-for="collar in collars" :key="collar.id" :value="collar.id">
          {{ collar.name }}
        </option>
      </select>

      <label for="filter">Фильтр:</label>
      <select v-model="filter" @change="fetchData">
        <option value="all">Все</option>
        <option value="day">По дням</option>
        <option value="month">По месяцам</option>
        <option value="year">По годам</option>
      </select>
    </div>

    <BarChart :chart-data="chartData" />
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
      collars: [],
      selectedCollar: null,
      filter: 'all',
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Размер порции',
            backgroundColor: '#42A5F5',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    async fetchCollars() {
      try {
        const response = await axios.post('http://localhost:8000/pet/get_pets_by_user', {
          access_token: localStorage.getItem('token'),
          token_type: 'bearer'
        })
        this.collars = response.data
        if (this.collars.length > 0) {
          this.selectedCollar = this.collars[0].id
          this.fetchData()
        }
      } catch (error) {
        console.error('Ошибка при получении ошейников:', error)
      }
    },

    // Функция для получения меток
    getLabels(data) {
      // Убедимся, что data является массивом и что каждый элемент имеет datetime
      return data.map(item => {
        if (item.datetime) {
          // Преобразуем в строку, если datetime существует
          return new Date(item.datetime).toLocaleDateString(); // или используйте любой формат, который вам нужен
        } else {
          return 'Неизвестно'; // Возвращаем дефолтное значение для случая отсутствия даты
        }
      });
    },

    // Функция для получения размеров порций
    getSizes(data) {
      return data.map(item => {
        return item.size || 0; // Если size отсутствует, вернем 0
      });
    },

    // Загрузка данных
    async fetchData() {
      if (!this.selectedCollar) return;
      try {
        console.log("Fetching data...");
        const response = await axios.post('http://localhost:8000/analitic/get_eating_activity', {
          pet_id: this.selectedCollar,
          type: this.filter
        });
        const data = response.data;
        console.log("Received data:", data);  // Печать полученных данных

        this.chartData = {
          labels: this.getLabels(data),  // Получаем метки
          datasets: [
            {
              label: 'Размер порции',
              backgroundColor: '#42A5F5',
              data: this.getSizes(data)  // Получаем размеры
            }
          ]
        };

        console.log("Chart data:", this.chartData);  // Проверка формата chartData
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    }
  },
  mounted() {
    this.fetchCollars()
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
