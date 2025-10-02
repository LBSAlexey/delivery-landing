<!-- frontend/src/components/HeroSection.vue -->
<template>
  <section class="hero">
    <div class="hero__container">
      <div class="hero__content">
        <h1 class="hero__title">
          Быстрая доставка <span class="hero__accent">за 30 минут</span>
        </h1>
        <p class="hero__subtitle">
          Закажите прямо сейчас и получите скидку 20% на первый заказ
        </p>
        <button 
          @click="scrollToForm" 
          class="hero__cta"
          aria-label="Оформить заказ">
          Оформить заказ
          <span class="hero__cta-icon">→</span>
        </button>
        
        <div class="hero__features">
          <div class="hero__feature">
            <span class="hero__feature-icon">⚡</span>
            <span class="hero__feature-text">Доставка 30 мин</span>
          </div>
          <div class="hero__feature">
            <span class="hero__feature-icon">🛡️</span>
            <span class="hero__feature-text">Гарантия качества</span>
          </div>
          <div class="hero__feature">
            <span class="hero__feature-icon">💰</span>
            <span class="hero__feature-text">Выгодные цены</span>
          </div>
        </div>
      </div>
      
      <div class="hero__image">
        <img 
          src="../assets/images/photos/delivery-landing_heroSection.png" 
          alt="Быстрая доставка" 
          class="hero__img"
          loading="eager">
      </div>
    </div>
  </section>
</template>

<script setup>
import { trackCTAClick } from '../../utils/analytics'

/**
 * Плавная прокрутка к форме заказа
 */
const scrollToForm = () => {
  const formElement = document.querySelector('#order-form')
  
  if (formElement) {
    formElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    
    // Отслеживаем клик по CTA
    trackCTAClick('Hero CTA Button')
  }
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
}

.hero__container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero__title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px 0;
}

.hero__accent {
  color: #ffd700;
}

.hero__subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.hero__cta {
  background: #ffd700;
  color: #333;
  border: none;
  padding: 18px 40px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.hero__cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
}

.hero__cta-icon {
  transition: transform 0.3s ease;
}

.hero__cta:hover .hero__cta-icon {
  transform: translateX(5px);
}

.hero__features {
  display: flex;
  gap: 30px;
  margin-top: 50px;
}

.hero__feature {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero__feature-icon {
  font-size: 1.5rem;
}

.hero__feature-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.hero__image {
  display: flex;
  justify-content: center;
  align-items: center;

}

.hero__img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
  border-radius: 10%;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero__container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero__title {
    font-size: 2.5rem;
  }
  
  .hero__features {
    flex-direction: column;
    gap: 15px;
  }
  
  .hero__image {
    order: -1;
  }
}
</style>
