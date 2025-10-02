/**
 * Модуль для отправки email уведомлений
 * Использует Nodemailer с Gmail SMTP
 */

import nodemailer from 'nodemailer'

/**
 * Получаем настройки из переменных окружения
 */
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const EMAIL_TO = process.env.EMAIL_TO

/**
 * Создаем транспорт для отправки email
 * Настройка для Gmail SMTP сервера
 */
const createTransporter = () => {
  // Валидация наличия обязательных переменных
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('⚠️ EMAIL_USER или EMAIL_PASSWORD не настроены')
    return null
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD // App Password, НЕ обычный пароль!
    },
    // Дополнительные настройки для надежности
    pool: true, // Использовать пул соединений
    maxConnections: 5,
    maxMessages: 100,
    secure: true // Использовать TLS
  })
}

/**
 * HTML шаблон письма с заказом
 * 
 * @param {Object} orderData - Данные заказа
 * @returns {string} - HTML содержимое письма
 */
const generateEmailTemplate = (orderData) => {
  const { name, phone, address, comment } = orderData
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow' 
  })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      border-radius: 10px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 8px;
    }
    .header {
      background: #667eea;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 20px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .info-row {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      width: 120px;
      color: #667eea;
    }
    .value {
      flex: 1;
      color: #333;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .timestamp {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="header">
        <h1>🚀 Новый заказ на доставку</h1>
      </div>
      
      <div class="info-row">
        <span class="label">👤 Имя:</span>
        <span class="value">${name}</span>
      </div>
      
      <div class="info-row">
        <span class="label">📞 Телефон:</span>
        <span class="value"><a href="tel:${phone}">${phone}</a></span>
      </div>
      
      <div class="info-row">
        <span class="label">📍 Адрес:</span>
        <span class="value">${address}</span>
      </div>
      
      ${comment ? `
      <div class="info-row">
        <span class="label">💬 Комментарий:</span>
        <span class="value">${comment}</span>
      </div>
      ` : ''}
      
      <div class="timestamp">
        🕐 Время получения: ${timestamp}
      </div>
      
      <div class="footer">
        <p><strong>Свяжитесь с клиентом как можно скорее!</strong></p>
        <p>Это автоматическое уведомление от системы Delivery Landing</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Текстовая версия письма (fallback для email клиентов без HTML)
 * 
 * @param {Object} orderData - Данные заказа
 * @returns {string} - Текстовое содержимое
 */
const generateTextTemplate = (orderData) => {
  const { name, phone, address, comment } = orderData
  const timestamp = new Date().toLocaleString('ru-RU', { 
    timeZone: 'Europe/Moscow' 
  })
  
  return `
НОВЫЙ ЗАКАЗ НА ДОСТАВКУ

Имя: ${name}
Телефон: ${phone}
Адрес: ${address}
${comment ? `Комментарий: ${comment}` : ''}

Время получения: ${timestamp}

Свяжитесь с клиентом как можно скорее!

---
Это автоматическое уведомление от системы Delivery Landing
  `.trim()
}

/**
 * Отправка email уведомления
 * 
 * @param {Object} orderData - Данные заказа
 * @throws {Error} - Выбрасывает ошибку при проблемах с отправкой
 */
export const sendEmail = async (orderData) => {
  try {
    // Создаем транспорт
    const transporter = createTransporter()
    
    if (!transporter) {
      throw new Error('Email транспорт не настроен. Проверьте EMAIL_USER и EMAIL_PASSWORD.')
    }
    
    if (!EMAIL_TO) {
      throw new Error('EMAIL_TO не установлен в .env файле')
    }
    
    // Настройки письма
    const mailOptions = {
      from: {
        name: 'Delivery Service',
        address: EMAIL_USER
      },
      to: EMAIL_TO,
      subject: `🆕 Новый заказ от ${orderData.name}`,
      html: generateEmailTemplate(orderData),
      text: generateTextTemplate(orderData),
      priority: 'high', // Высокий приоритет
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    }
    
    // Отправляем письмо
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email отправлен:', {
      messageId: info.messageId,
      to: EMAIL_TO,
      accepted: info.accepted
    })
    
    return info
    
  } catch (error) {
    // Обработка ошибок
    console.error('❌ Ошибка отправки email:', error.message)
    
    if (error.code === 'EAUTH') {
      throw new Error('Ошибка авторизации Gmail. Проверьте EMAIL_USER и EMAIL_PASSWORD (используйте App Password)')
    } else if (error.code === 'ESOCKET') {
      throw new Error('Не удалось подключиться к Gmail SMTP серверу')
    } else if (error.responseCode === 550) {
      throw new Error('Неверный email адрес получателя')
    } else {
      throw new Error(`Ошибка отправки email: ${error.message}`)
    }
  }
}

/**
 * Тестовая функция для проверки подключения к SMTP
 */
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      console.warn('⚠️ Email транспорт не настроен')
      return false
    }
    
    await transporter.verify()
    console.log('✅ Email SMTP подключение успешно')
    return true
  } catch (error) {
    console.error('❌ Не удалось подключиться к Email SMTP:', error.message)
    return false
  }
}
