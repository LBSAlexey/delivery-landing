<!-- frontend/src/components/FooterSection.vue -->
<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__grid">
        <!-- О компании -->
        <div class="footer__column">
          <h3 class="footer__heading">О нас</h3>
          <p class="footer__text">
            Мы — сервис быстрой доставки, работающий с 2020 года. 
            Доставляем грузы по всему городу за 30 минут.
          </p>
          <div class="footer__social">
            <a 
              href="https://vk.com/yourcompany" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label="VK">
              VK
            </a>
            <a 
              href="https://t.me/yourcompany" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label="Telegram">
              TG
            </a>
            <a 
              href="https://wa.me/79991234567" 
              target="_blank" 
              rel="noopener noreferrer"
              class="footer__social-link"
              aria-label="WhatsApp">
              WA
            </a>
          </div>
        </div>

        <!-- Контакты -->
        <div class="footer__column">
          <h3 class="footer__heading">Контакты</h3>
          <ul class="footer__list">
            <li class="footer__list-item">
              <span class="footer__icon">📞</span>
              <a href="tel:+79991234567" class="footer__link">
                +7 (999) 123-45-67
              </a>
            </li>
            <li class="footer__list-item">
              <span class="footer__icon">📧</span>
              <a href="mailto:info@delivery.ru" class="footer__link">
                info@delivery.ru
              </a>
            </li>
            <li class="footer__list-item">
              <span class="footer__icon">📍</span>
              <span class="footer__text-small">
                г. Москва, ул. Примерная, 10
              </span>
            </li>
          </ul>
        </div>

        <!-- Услуги -->
        <div class="footer__column">
          <h3 class="footer__heading">Услуги</h3>
          <ul class="footer__list">
            <li class="footer__list-item">
              <a href="#" class="footer__link">Экспресс доставка</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Доставка документов</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Грузоперевозки</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Корпоративным клиентам</a>
            </li>
          </ul>
        </div>

        <!-- Информация -->
        <div class="footer__column">
          <h3 class="footer__heading">Информация</h3>
          <ul class="footer__list">
            <li class="footer__list-item">
              <a href="#" class="footer__link">Оплата и доставка</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Политика конфиденциальности</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Пользовательское соглашение</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Вакансии</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Копирайт -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} Delivery Service. Все права защищены.
        </p>
        <p class="footer__note">
          Сделано с ❤️ для быстрой доставки
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Автоматически получаем текущий год для копирайта
 */
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: #1f2937;
  color: #e5e7eb;
  padding: 60px 20px 30px;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 50px;
}

.footer__column {
  display: flex;
  flex-direction: column;
}

.footer__heading {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: white;
}

.footer__text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #9ca3af;
  margin: 0 0 20px 0;
}

.footer__text-small {
  font-size: 0.95rem;
  color: #9ca3af;
}

.footer__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__list-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer__icon {
  font-size: 1rem;
}

.footer__link {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer__link:hover {
  color: #667eea;
}

.footer__social {
  display: flex;
  gap: 15px;
}

.footer__social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #374151;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.footer__social-link:hover {
  background: #667eea;
  transform: translateY(-3px);
}

.footer__bottom {
  border-top: 1px solid #374151;
  padding-top: 30px;
  text-align: center;
}

.footer__copyright {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0 0 10px 0;
}

.footer__note {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
