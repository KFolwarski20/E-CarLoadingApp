<script setup>
import EnergyMixCharts from "./components/energyMixCharts.vue"
import ChargingCalculator from "./components/chargingCalculator.vue"
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
    <EnergyMixCharts />
      <h1 class="text-3xl font-bold text-center mb-8">
        Are you going to charge your car now? Let's check the optimal period of time
      </h1>
    <ChargingCalculator />
  </div>
</template>