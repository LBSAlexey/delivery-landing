/**
 * Главный файл Express сервера
 * Обрабатывает API запросы от frontend
 */
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { sendToTelegram, testTelegramConnection } from './services/telegram.js'
import { sendEmail, testEmailConnection } from './services/email.js'

// Загружаем переменные окружения из .env файла
dotenv.config()

// Создаем приложение Express
const app = express()
const PORT = process.env.PORT || 3000

// ===== MIDDLEWARE =====

// CORS - разрешаем запросы с frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.github.io' 
    : 'http://localhost:5173', // Vite dev server
  credentials: true
}))

// Парсинг JSON тела запроса
app.use(express.json())

// Логирование запросов в development режиме
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`)
    next()
  })
}

// ===== ROUTES (Эндпойнты) =====

/**
 * Health check endpoint
 * Проверка работоспособности API
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend работает!',
    timestamp: new Date().toISOString()
  })
})

/**
 * Endpoint для обработки заказов
 * POST /api/order
 */
app.post('/api/order', async (req, res) => {
  try {
    const { name, phone, address, comment } = req.body
    
    // Валидация обязательных полей
    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: 'Заполните все обязательные поля: имя, телефон, адрес'
      })
    }
    
    // Базовая валидация имени (минимум 2 символа)
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Имя должно содержать минимум 2 символа'
      })
    }
    
    // Валидация телефона (хотя бы 10 цифр)
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Введите корректный номер телефона'
      })
    }
    
    // Подготавливаем данные заказа
    const orderData = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      comment: comment ? comment.trim() : ''
    }
    
    // Логируем получение заказа
    console.log('📦 Новый заказ получен:', {
      name: orderData.name,
      phone: orderData.phone,
      timestamp: new Date().toLocaleString('ru-RU')
    })
    
    // Массив промисов для параллельной отправки
    const promises = []
    
    // Отправляем в Telegram (если настроен)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      promises.push(
        sendToTelegram(orderData).catch(error => {
          console.error('⚠️ Ошибка отправки в Telegram:', error.message)
          return { service: 'telegram', error: error.message }
        })
      )
    }
    
    // Отправляем на Email (если настроен)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      promises.push(
        sendEmail(orderData).catch(error => {
          console.error('⚠️ Ошибка отправки Email:', error.message)
          return { service: 'email', error: error.message }
        })
      )
    }
    
    // Ждем выполнения всех отправок
    const results = await Promise.all(promises)
    
    // Проверяем есть ли ошибки
    const errors = results.filter(r => r && r.error)
    
    if (errors.length === results.length && results.length > 0) {
      // Все отправки провалились
      return res.status(500).json({
        success: false,
        error: 'Не удалось отправить уведомления. Попробуйте позже.'
      })
    }
    
    // Успешный ответ
    res.status(200).json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      orderId: Date.now() // Временный ID для отладки
    })
    
  } catch (error) {
    console.error('❌ Ошибка обработки заказа:', error)
    
    res.status(500).json({
      success: false,
      error: 'Произошла ошибка сервера. Попробуйте позже.'
    })
  }
})

// ===== ERROR HANDLING =====

// 404 - Route не найден
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint не найден'
  })
})

// Обработчик общих ошибок
app.use((error, req, res, next) => {
  console.error('💥 Необработанная ошибка:', error)
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  })
})

// ===== ЗАПУСК СЕРВЕРА =====

app.listen(PORT, async () => {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
  console.log(`📅 ${new Date().toLocaleString('ru-RU')}`)
  console.log(`🌍 Окружение: ${process.env.NODE_ENV || 'development'}`)
  console.log('='.repeat(50))
  
  // Тестируем подключения при старте
  console.log('\n🔍 Проверка подключений...\n')
  
  // Проверяем Telegram
  if (process.env.TELEGRAM_BOT_TOKEN) {
    await testTelegramConnection()
  } else {
    console.log('⚠️  Telegram не настроен F(TELEGRAM_BOT_TOKEN отсутствует)')
  }
  
  // Проверяем Email
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    await testEmailConnection()
  } else {
    console.log('⚠️  Email не настроен (EMAIL_USER или EMAIL_PASSWORD отсутствуют)')
  }
  
  console.log(`\n✅ Сервер готов принимать запросы!\n`)
})

// Обработка graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Получен сигнал SIGTERM, завершение работы...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n👋 Получен сигнал SIGINT, завершение работы...')
  process.exit(0)
})
