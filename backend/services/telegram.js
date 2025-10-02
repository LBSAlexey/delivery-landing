/**
 * Модуль для отправки уведомлений в Telegram
 * Использует официальный Telegram Bot API
 */

import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
/**
 * Получаем данные бота из переменных окружения
 */
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID



/**
 * Базовый URL Telegram Bot API
 */
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
console.log(TELEGRAM_BOT_TOKEN)

/**
 * Форматирование сообщения для Telegram с HTML разметкой
 * 
 * @param {Object} orderData - Данные заказа
 * @returns {string} - Форматированное сообщение
 */
const formatOrderMessage = (orderData) => {
  const { name, phone, address, comment } = orderData
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow' 
  })
  
  return `
🆕 <b>НОВЫЙ ЗАКАЗ!</b>

👤 <b>Имя:</b> ${name}
📞 <b>Телефон:</b> <code>${phone}</code>
📍 <b>Адрес:</b> ${address}
${comment ? `💬 <b>Комментарий:</b> ${comment}` : ''}

🕐 <b>Время:</b> ${timestamp}

<i>Свяжитесь с клиентом как можно скорее!</i>
  `.trim()
}

/**
 * Отправка сообщения в Telegram
 * 
 * @param {Object} orderData - Данные заказа
 * @throws {Error} - Выбрасывает ошибку при проблемах с отправкой
 */
export const sendToTelegram = async (orderData) => {
  try {
    // Валидация наличия токена и chat_id
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN не установлен в .env файле')
    }
    
    if (!TELEGRAM_CHAT_ID) {
      throw new Error('TELEGRAM_CHAT_ID не установлен в .env файле')
    }
    
    // Форматируем сообщение
    const message = formatOrderMessage(orderData)
    
    // Отправляем POST запрос к Telegram API
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML', // Поддержка HTML форматирования
      disable_web_page_preview: true // Отключаем превью ссылок
    })
    
    // Проверяем успешность отправки
    if (response.data.ok) {
      console.log('✅ Сообщение отправлено в Telegram')
      return response.data
    } else {
      throw new Error('Telegram API вернул ошибку')
    }
    
  } catch (error) {
    // Обработка различных типов ошибок
    if (error.response) {
      // Ошибка от Telegram API
      const errorCode = error.response.data?.error_code
      const errorDescription = error.response.data?.description
      
      console.error('❌ Ошибка Telegram API:', {
        code: errorCode,
        description: errorDescription
      })
      
      // Специфичные коды ошибок Telegram
      switch (errorCode) {
        case 400:
          throw new Error('Неверный формат данных для Telegram')
        case 401:
          throw new Error('Неверный токен бота Telegram')
        case 403:
          throw new Error('Бот не имеет доступа к чату')
        case 404:
          throw new Error('Чат не найден. Проверьте TELEGRAM_CHAT_ID')
        default:
          throw new Error(`Telegram API ошибка: ${errorDescription}`)
      }
    } else if (error.request) {
      // Нет ответа от Telegram
      console.error('❌ Telegram не отвечает:', error.message)
      throw new Error('Не удалось связаться с Telegram. Проверьте интернет-соединение.')
    } else {
      // Ошибка настройки запроса
      console.error('❌ Ошибка отправки в Telegram:', error.message)
      throw error
    }
  }
}

/**
 * Тестовая функция для проверки подключения к Telegram
 * Можно вызвать при старте сервера для проверки
 */
export const testTelegramConnection = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getMe`)
    
    if (response.data.ok) {
      const botInfo = response.data.result
      console.log('✅ Telegram Bot подключен:', {
        username: botInfo.username,
        name: botInfo.first_name,
        id: botInfo.id
      })
      return true
    }
    return false
  } catch (error) {

    console.error('❌ Не удалось подключиться к Telegram Bot:', error.message)
    return false
  }
}
