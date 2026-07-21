<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";


const API_URL = import.meta.env.VITE_API_URL;

const days = ref([]);
const loading = ref(true);

const COLORS = [
  "#22c55e", // biomass
  "#374151", // coal
  "#3b82f6", // imports
  "#ef4444", // gas
  "#a855f7", // nuclear
  "#6b7280", // other
  "#06b6d4", // hydro
  "#f59e0b", // solar
  "#10b981"  // wind
];

function getDayLabel(index) {
  const labels = [
    "Today",
    "Tomorrow",
    "The day after tomorrow"
  ];

  return labels[index];
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
}

const chartOptions = {
  chart: {
    type: "donut",
    animations: {
      enabled: false
    }
  },
  labels: [],
  colors: COLORS,
  legend: {
    show: true
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    y: {
      formatter: function (value) {
        return value.toFixed(2) + "%";
      }
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%"
      }
    }
  }
};

onMounted(async()=>{
  try {
    const res =
      await axios.get(
        `${API_URL}/energy/mix`
      );
    days.value =
      Object.entries(res.data)
      .slice(0,3)
      .map(([date,value])=>({
        date,
        labels:
          Object.keys(value.mix),
        series:
          Object.values(value.mix),
        clean:
          value.cleanPercentage
      }));
  }
  catch(err){
    console.error(
      "Energy API error",
      err
    );
  }
  finally{
    loading.value=false;
  }
});
</script>

<template>
  <div class="p-6">
      <h1 class="text-3xl font-bold text-center mb-8">
        Energy mix for a few days
      </h1>
    <div v-if="loading" class="text-3xl font-bold text-center mb-8">
      Loading data...
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(day, index) in days" :key="day.date" class=" bg-white rounded-xl shadow p-5 flex flex-col items-center">
        <h2 class="font-bold text-lg">{{ getDayLabel(index) }}</h2>
        <h2 class="font-bold mb-2">{{ formatDate(day.date) }}</h2>
        <p class="text-green-600 mb-4">Clean energy: {{day.clean}}%</p>
        <apexchart type="donut" width="260"
        :options="{
        ...chartOptions,
        labels: day.labels
        }"
        :series="day.series"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components:{
  apexchart: VueApexCharts
  }
}
</script>