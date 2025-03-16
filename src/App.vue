<script setup>
import { ref, computed } from 'vue'
import Reg from './components/Reg.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

const routes = {
  '/reg': Reg,
  '/login': Login,
  '/home': Home,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>


<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo2.png" width="125" height="125" />
    <h1>PET HOME</h1>
    
  <a href="#/login">Вход</a> |
  <a href="#/reg">Регистрация</a> |
  <a href="#/home">Главная</a> 
  </header>
     <main>
  <component :is="currentView" />
  </main>

  <main>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
