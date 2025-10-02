import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { sendToTelegram, testTelegramConnection } from './services/telegram.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.github.io' 
    : 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`)
    next()
  })
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend работает!',
    timestamp: new Date().toISOString()
  })
})

app.post('/api/order', async (req, res) => {
  try {
    const { name, email, phone, address, comment } = req.body
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: 'Заполните все обязательные поля'
      })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Введите корректный email адрес'
      })
    }

    const orderData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      comment: comment ? comment.trim() : ''
    }

    console.log('📦 Новый заказ для Telegram:', {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone
    })

    // ТОЛЬКО ОТПРАВКА В TELEGRAM
    await sendToTelegram(orderData)

    res.status(200).json({
      success: true,
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
      orderId: Date.now()
    })

  } catch (error) {
    console.error('❌ Ошибка заказа:', error)
    res.status(500).json({
      success: false,
      error: 'Произошла ошибка сервера. Попробуйте позже.'
    })
  }
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint не найден'
  })
})

// Можно оставить, чтобы убедиться в работе Telegram при запуске
app.listen(PORT, async () => {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
  console.log('='.repeat(50))
  if (process.env.TELEGRAM_BOT_TOKEN) {
    await testTelegramConnection()
  } else {
    console.log('⚠️  Telegram не настроен (TELEGRAM_BOT_TOKEN отсутствует)')
  }
})
