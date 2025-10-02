/**
 * API модуль для работы с backend
 * Использует axios для HTTP запросов
 */

import axios from 'axios'

/**
 * Получаем базовый URL из переменных окружения
 * В development режиме: http://localhost:3000
 * В production: URL вашего API сервера
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Создаем экземпляр axios с базовой конфигурацией
 * Это позволяет переиспользовать настройки для всех запросов
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Таймаут 15 секунд
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

/**
 * Request Interceptor
 * Вызывается ДО отправки каждого запроса
 * Можно добавлять заголовки, логировать запросы и т.д.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Добавляем timestamp для отслеживания времени запроса
    config.metadata = { startTime: new Date().getTime() }
    
    // Логирование запроса в development режиме
    if (import.meta.env.DEV) {
      console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    // Можно добавить токен авторизации, если нужен
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    
    return config
  },
  (error) => {
    // Обработка ошибки при настройке запроса
    console.error('❌ Request setup error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Вызывается ПОСЛЕ получения ответа от сервера
 * Можно обрабатывать ответы, логировать, обрабатывать ошибки
 */
apiClient.interceptors.response.use(
  (response) => {
    // Вычисляем время выполнения запроса
    const endTime = new Date().getTime()
    const duration = endTime - response.config.metadata.startTime
    
    // Логирование успешного ответа в development
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        `| Duration: ${duration}ms`,
        `| Status: ${response.status}`
      )
    }
    
    return response
  },
  (error) => {
    // Обработка ошибок ответа
    const duration = error.config?.metadata 
      ? new Date().getTime() - error.config.metadata.startTime 
      : 0
    
    if (import.meta.env.DEV) {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        `| Duration: ${duration}ms`,
        error
      )
    }
    
    // Можно добавить логику обработки специфичных ошибок
    // Например, редирект на логин при 401
    // if (error.response?.status === 401) {
    //   window.location.href = '/login'
    // }
    
    return Promise.reject(error)
  }
)

/**
 * Функция обработки ошибок axios
 * Преобразует технические ошибки в понятные пользователю сообщения
 * 
 * @param {Error} error - Объект ошибки от axios
 * @returns {string} - Понятное сообщение об ошибке
 */
const handleApiError = (error) => {
  // Проверяем тип ошибки и возвращаем соответствующее сообщение
  
  if (error.response) {
    // Сервер ответил с кодом ошибки (4xx, 5xx)
    const status = error.response.status
    const message = error.response.data?.error || error.response.data?.message
    
    switch (status) {
      case 400:
        return message || 'Неверные данные. Проверьте заполнение формы.'
      case 401:
        return 'Требуется авторизация.'
      case 403:
        return 'Доступ запрещен.'
      case 404:
        return 'Запрашиваемый ресурс не найден.'
      case 408:
        return 'Время ожидания истекло. Попробуйте еще раз.'
      case 429:
        return 'Слишком много запросов. Подождите немного.'
      case 500:
        return 'Ошибка сервера. Мы уже работаем над исправлением.'
      case 502:
      case 503:
        return 'Сервер временно недоступен. Попробуйте позже.'
      default:
        return message || `Ошибка: ${status}`
    }
  } else if (error.request) {
    // Запрос был отправлен, но ответа не получено
    // Проблемы с сетью или сервер не отвечает
    return 'Не удается связаться с сервером. Проверьте подключение к интернету.'
  } else if (error.code === 'ECONNABORTED') {
    // Таймаут запроса
    return 'Превышено время ожидания ответа. Попробуйте еще раз.'
  } else {
    // Ошибка при настройке запроса
    return error.message || 'Произошла неизвестная ошибка.'
  }
}

/**
 * Отправка данных формы заказа на backend
 * 
 * @param {Object} orderData - Данные заказа
 * @param {string} orderData.name - Имя клиента
 * @param {string} orderData.phone - Телефон клиента
 * @param {string} orderData.address - Адрес доставки
 * @param {string} [orderData.comment] - Комментарий к заказу (необязательно)
 * @returns {Promise<Object>} - Промис с ответом сервера
 * @throws {Error} - Выбрасывает ошибку с понятным сообщением
 */
export const submitOrder = async (orderData) => {
  try {
    // Валидация данных на клиенте (дополнительная проверка)
    if (!orderData.name || !orderData.phone || !orderData.address) {
      throw new Error('Заполните все обязательные поля')
    }
    
    // Отправляем POST запрос на endpoint /api/order
    const response = await apiClient.post('/api/order', orderData)
    
    // Возвращаем данные из ответа
    return response.data
  } catch (error) {
    // Обрабатываем ошибку и выбрасываем с понятным сообщением
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}

/**
 * Проверка здоровья API (health check)
 * Можно использовать для проверки доступности backend
 * 
 * @returns {Promise<Object>} - Статус API
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/api/health')
    return response.data
  } catch (error) {
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}

/**
 * Пример функции для будущих эндпойнтов
 * Получение списка услуг (если понадобится)
 * 
 * @returns {Promise<Array>} - Массив услуг
 */
export const getServices = async () => {
  try {
    const response = await apiClient.get('/api/services')
    return response.data
  } catch (error) {
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}

/**
 * Экспортируем экземпляр apiClient для прямого использования
 * если нужны кастомные запросы
 */
export default apiClient
