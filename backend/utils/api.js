import axios from 'axios'

// Базовый URL API (берется из переменных окружения)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Создаем экземпляр axios с настройками
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 секунд таймаут
})

/**
 * Отправка заказа на backend
 * @param {Object} orderData - Данные формы заказа
 * @returns {Promise} - Промис с ответом сервера
 */
export const submitOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/api/order', orderData)
    return response.data
  } catch (error) {
    // Обработка ошибок
    if (error.response) {
      // Сервер ответил с ошибкой
      throw new Error(error.response.data.error || 'Ошибка сервера')
    } else if (error.request) {
      // Запрос отправлен, но ответа нет
      throw new Error('Сервер не отвечает')
    } else {
      // Ошибка при настройке запроса
      throw new Error('Ошибка отправки данных')
    }
  }
}

export default apiClient
