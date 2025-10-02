<!-- frontend/src/components/AdvantagesSection.vue -->
<template>
  <section class="advantages">
    <div class="advantages__container">
      <h2 class="advantages__title">Почему выбирают нас</h2>
      <p class="advantages__subtitle">
        Мы предлагаем лучший сервис доставки в городе
      </p>
      
      <div class="advantages__grid">
        <div 
          v-for="advantage in advantages" 
          :key="advantage.id"
          class="advantage-card"
          :class="`advantage-card--${advantage.color}`">
          <div class="advantage-card__icon">{{ advantage.icon }}</div>
          <h3 class="advantage-card__title">{{ advantage.title }}</h3>
          <p class="advantage-card__description">{{ advantage.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Список преимуществ сервиса
 */
const advantages = ref([
  {
    id: 1,
    icon: '🚀',
    title: 'Быстрая доставка',
    description: 'Доставим ваш заказ за 30 минут или вернем деньги',
    color: 'blue'
  },
  {
    id: 2,
    icon: '💰',
    title: 'Выгодные цены',
    description: 'Скидки до 25% для постоянных клиентов и акции каждую неделю',
    color: 'green'
  },
  {
    id: 3,
    icon: '🛡️',
    title: 'Гарантия качества',
    description: 'Страхование груза и полная ответственность за сохранность',
    color: 'purple'
  },
  {
    id: 4,
    icon: '📱',
    title: 'Онлайн отслеживание',
    description: 'Следите за курьером в реальном времени через приложение',
    color: 'orange'
  },
  {
    id: 5,
    icon: '⭐',
    title: 'Высокий рейтинг',
    description: '4.9 из 5 звезд по отзывам более 10,000 клиентов',
    color: 'yellow'
  },
  {
    id: 6,
    icon: '🎁',
    title: 'Бонусная программа',
    description: 'Накапливайте баллы и получайте бесплатные доставки',
    color: 'red'
  }
])
</script>

<style scoped>
.advantages {
  padding: 100px 20px;
  background: #f8f9fa;
}

.advantages__container {
  max-width: 1200px;
  margin: 0 auto;
}

.advantages__title {
  font-size: 2.5rem;
  text-align: center;
  margin: 0 0 15px 0;
  color: #333;
}

.advantages__subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: #666;
  margin: 0 0 60px 0;
}

.advantages__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.advantage-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;
}

.advantage-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.advantage-card__icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.advantage-card__title {
  font-size: 1.5rem;
  margin: 0 0 15px 0;
  color: #333;
}

.advantage-card__description {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Цветовые акценты */
.advantage-card--blue:hover { border-top: 4px solid #667eea; }
.advantage-card--green:hover { border-top: 4px solid #10b981; }
.advantage-card--purple:hover { border-top: 4px solid #764ba2; }
.advantage-card--orange:hover { border-top: 4px solid #f97316; }
.advantage-card--yellow:hover { border-top: 4px solid #fbbf24; }
.advantage-card--red:hover { border-top: 4px solid #ef4444; }

@media (max-width: 768px) {
  .advantages__grid {
    grid-template-columns: 1fr;
  }
}
</style>
