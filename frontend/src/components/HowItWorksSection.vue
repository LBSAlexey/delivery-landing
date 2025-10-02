<!-- frontend/src/components/HowItWorksSection.vue -->
<template>
  <section class="how-it-works">
    <div class="how-it-works__container">
      <h2 class="how-it-works__title">Как это работает</h2>
      
      <div class="steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step"
          :class="{ 'step--active': activeStep === index }"
          @mouseenter="setActiveStep(index)"
          @mouseleave="resetActiveStep">
          
          <div class="step__number">
            <span>{{ index + 1 }}</span>
          </div>
          
          <div class="step__content">
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__description">{{ step.description }}</p>
          </div>
          
          <div v-if="index < steps.length - 1" class="step__arrow">
            →
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Шаги процесса заказа
 */
const steps = ref([
  {
    title: 'Заполните форму',
    description: 'Укажите ваше имя, телефон, адрес доставки и детали заказа'
  },
  {
    title: 'Получите подтверждение',
    description: 'Менеджер свяжется с вами в течение 2 минут для уточнения деталей'
  },
  {
    title: 'Ожидайте курьера',
    description: 'Курьер заберет груз и доставит по указанному адресу за 30 минут'
  },
  {
    title: 'Получите заказ',
    description: 'Примите доставку, оплатите удобным способом и оцените сервис'
  }
])

/**
 * Активный шаг при наведении
 */
const activeStep = ref(-1)

const setActiveStep = (index) => {
  activeStep.value = index
}

const resetActiveStep = () => {
  activeStep.value = -1
}
</script>

<style scoped>
.how-it-works {
  padding: 100px 20px;
  background: white;
}

.how-it-works__container {
  max-width: 1200px;
  margin: 0 auto;
}

.how-it-works__title {
  font-size: 2.5rem;
  text-align: center;
  margin: 0 0 80px 0;
  color: #333;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}

.step:hover,
.step--active {
  background: #f8f9fa;
  transform: scale(1.05);
}

.step__number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.step:hover .step__number,
.step--active .step__number {
  transform: rotate(360deg);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.step__title {
  font-size: 1.25rem;
  margin: 0 0 10px 0;
  color: #333;
}

.step__description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.step__arrow {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #667eea;
  display: none;
}

@media (min-width: 1024px) {
  .steps {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .step__arrow {
    display: block;
  }
  
  .step:last-child .step__arrow {
    display: none;
  }
}

@media (max-width: 768px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
