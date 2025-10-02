<template>
  <div id="app" class="app">
    <HeroSection />
    <AdvantagesSection />
    <HowItWorksSection />
    <OrderForm />
    <FooterSection />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import AdvantagesSection from './components/AdvantagesSection.vue'
import HowItWorksSection from './components/HowItWorksSection.vue'
import OrderForm from './components/OrderForm.vue'
import FooterSection from './components/FooterSection.vue'
// import { trackPageView } from '../utils/analytics'


onMounted(() => {
  // trackPageView()
})
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/style.css';
@import './assets/styles/responsive.css';
</style>
