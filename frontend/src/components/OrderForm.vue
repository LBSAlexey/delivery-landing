<template>
  <section id="order-form" class="order-form">
    <div class="order-form__container">
      <h2 class="order-form__title">Оформить заказ</h2>
      <p class="order-form__subtitle">
        Заполните форму и мы свяжемся с вами в течение 2 минут
      </p>
      
      <form @submit.prevent="handleSubmit" class="form" novalidate>
        <!-- Имя -->
        <div class="form__group">
          <label for="name" class="form__label">
            Ваше имя <span class="form__required">*</span>
          </label>
          <input
            id="name"
            v-model.trim="formData.name"
            type="text"
            class="form__input"
            :class="{ 'form__input--error': errors.name }"
            placeholder="Иван Иванов"
            @blur="validateField('name')"
            @input="clearFieldError('name')"
          >
          <span v-if="errors.name" class="form__error">
            {{ errors.name }}
          </span>
        </div>

        <!-- Email (НОВОЕ ПОЛЕ) -->
        <div class="form__group">
          <label for="email" class="form__label">
            Email <span class="form__required">*</span>
          </label>
          <input
            id="email"
            v-model.trim="formData.email"
            type="email"
            class="form__input"
            :class="{ 'form__input--error': errors.email }"
            placeholder="example@mail.com"
            @blur="validateField('email')"
            @input="clearFieldError('email')"
          >
          <span v-if="errors.email" class="form__error">
            {{ errors.email }}
          </span>
        </div>

        <!-- Телефон -->
        <div class="form__group">
          <label for="phone" class="form__label">
            Телефон <span class="form__required">*</span>
          </label>
          <input
            id="phone"
            v-model.trim="formData.phone"
            type="tel"
            class="form__input"
            :class="{ 'form__input--error': errors.phone }"
            placeholder="+7 (999) 123-45-67"
            @blur="validateField('phone')"
            @input="clearFieldError('phone')"
          >
          <span v-if="errors.phone" class="form__error">
            {{ errors.phone }}
          </span>
        </div>

        <!-- Адрес -->
        <div class="form__group">
          <label for="address" class="form__label">
            Адрес доставки <span class="form__required">*</span>
          </label>
          <input
            id="address"
            v-model.trim="formData.address"
            type="text"
            class="form__input"
            :class="{ 'form__input--error': errors.address }"
            placeholder="ул. Пушкина, д. 10, кв. 5"
            @blur="validateField('address')"
            @input="clearFieldError('address')"
          >
          <span v-if="errors.address" class="form__error">
            {{ errors.address }}
          </span>
        </div>

        <!-- Комментарий -->
        <div class="form__group">
          <label for="comment" class="form__label">
            Комментарий к заказу
          </label>
          <textarea
            id="comment"
            v-model.trim="formData.comment"
            class="form__textarea"
            placeholder="Дополнительная информация (необязательно)"
            rows="4"
          ></textarea>
        </div>

        <!-- Кнопка -->
        <button
          type="submit"
          class="form__submit"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Отправить заявку</span>
          <span v-else>
            <span class="spinner"></span> Отправка...
          </span>
        </button>

        <!-- Сообщения -->
        <transition name="fade">
          <div v-if="successMessage" class="form__message form__message--success">
            ✓ {{ successMessage }}
          </div>
        </transition>

        <transition name="fade">
          <div v-if="errorMessage" class="form__message form__message--error">
            ✗ {{ errorMessage }}
          </div>
        </transition>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { submitOrder } from '../../utils/api'
import { trackConversion } from '../../utils/analytics'

/**
 * Данные формы (добавлен email)
 */
const formData = reactive({
  name: '',
  email: '',  // ← НОВОЕ ПОЛЕ
  phone: '',
  address: '',
  comment: ''
})

/**
 * Ошибки валидации (добавлен email)
 */
const errors = reactive({
  name: '',
  email: '',  // ← НОВАЯ ОШИБКА
  phone: '',
  address: ''
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

/**
 * Валидация отдельного поля (добавлен email)
 */
const validateField = (fieldName) => {
  switch (fieldName) {
    case 'name':
      if (!formData.name) {
        errors.name = 'Введите ваше имя'
      } else if (formData.name.length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа'
      } else {
        errors.name = ''
      }
      break

    case 'email':  // ← НОВАЯ ВАЛИДАЦИЯ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email) {
        errors.email = 'Введите ваш email'
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email адрес'
      } else {
        errors.email = ''
      }
      break

    case 'phone':
      const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/
      if (!formData.phone) {
        errors.phone = 'Введите номер телефона'
      } else if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Введите корректный номер телефона'
      } else {
        errors.phone = ''
      }
      break

    case 'address':
      if (!formData.address) {
        errors.address = 'Укажите адрес доставки'
      } else if (formData.address.length < 5) {
        errors.address = 'Адрес слишком короткий'
      } else {
        errors.address = ''
      }
      break
  }
}

const clearFieldError = (fieldName) => {
  errors[fieldName] = ''
  errorMessage.value = ''
}

/**
 * Валидация всей формы (добавлена проверка email)
 */
const validateForm = () => {
  validateField('name')
  validateField('email')  // ← ПРОВЕРКА EMAIL
  validateField('phone')
  validateField('address')

  return !errors.name && !errors.email && !errors.phone && !errors.address
}

/**
 * Обработка отправки формы
 */
const handleSubmit = async () => {
  if (!validateForm()) {
    errorMessage.value = 'Пожалуйста, исправьте ошибки в форме'
    return
  }

  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await submitOrder(formData)
    
    successMessage.value = 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.'
    trackConversion('order_submit')
    
    setTimeout(() => {
      resetForm()
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}
</script>

<style scoped>
.order-form {
  padding: 100px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-form__container {
  max-width: 600px;
  margin: 0 auto;
}

.order-form__title {
  font-size: 2.5rem;
  text-align: center;
  margin: 0 0 15px 0;
  color: white;
}

.order-form__subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 50px 0;
}

.form {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.form__group {
  margin-bottom: 25px;
}

.form__label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form__required {
  color: #ef4444;
}

.form__input,
.form__textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form__input:focus,
.form__textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form__input--error {
  border-color: #ef4444;
}

.form__error {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 5px;
}

.form__submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.form__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.form__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form__submit--loading {
  position: relative;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form__message {
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
}

.form__message--success {
  background: #d1fae5;
  color: #065f46;
}

.form__message--error {
  background: #fee2e2;
  color: #991b1b;
}

/* Анимация появления сообщений */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .form {
    padding: 30px 20px;
  }
}
</style>
