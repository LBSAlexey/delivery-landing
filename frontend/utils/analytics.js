/**
 * Отправка события конверсии во все системы аналитики
 * @param {string} eventName - Название события
 * @param {Object} eventData - Дополнительные данные события
 */
export const trackConversion = (eventName = 'order_submit', eventData = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: 'Order Form',
      ...eventData
    })
    console.log('✅ GA4 событие отправлено:', eventName)
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'Lead', eventData)
    console.log('✅ Facebook Pixel событие отправлено')
  }

  // Яндекс Метрика
  if (window.ym) {
    const counterId = window.ymCounterId // ID счетчика из window
    if (counterId) {
      window.ym(counterId, 'reachGoal', eventName, eventData)
      console.log('✅ Яндекс Метрика цель достигнута:', eventName)
    }
  }
}

/**
 * Отслеживание просмотра страницы
 */
export const trackPageView = () => {
  if (window.gtag) {
    window.gtag('event', 'page_view')
  }
  if (window.fbq) {
    window.fbq('track', 'PageView')
  }
  console.log('📊 Просмотр страницы отслежен')
}

/**
 * Отслеживание клика по кнопке CTA
 */
export const trackCTAClick = (buttonName) => {
  if (window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'Button',
      event_label: buttonName
    })
  }
  console.log('🔘 Клик по CTA:', buttonName)
}
