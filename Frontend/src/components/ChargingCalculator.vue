<script setup>
import { ref } from "vue";
import axios from "axios";


const API_URL =
  "https://e-carloadingapp.onrender.com/api";


const hours = ref(1);
const loading = ref(false);
const result = ref(null);
const error = ref(null);


const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];


async function calculate(){
  loading.value = true;
  error.value = null;
  
  try {
    const res =
      await axios.post(
        `${API_URL}/charging/optimal-window`,
        {
          durationHours: Number(hours.value)
        }
      );
    result.value = res.data;
  }
  catch(err){
    console.error(err);
    error.value =
      "Something went wrong. Unable to retrieve data..";
  }
  finally{
    loading.value = false;
  }
}

function formatDate(value){

  const date = value.substring(0, 10);
  const time = value.substring(11, 16);

  const [year, month, day] = date.split("-");

  return `${day} ${months[Number(month) - 1]} ${year} at ${time}`;
}

</script>


<template>
  <div class="bg-white rounded-xl shadow p-6 mx-auto mt-10">
    <label class="block mb-2">
    How much time you want to charge your car [1h - 6h]?
    </label>
    <select v-model="hours" class="border rounded w-full p-2 mb-4">
      <option v-for="h in 6" :key="h" :value="h">
      {{h}} hour{{h > 1 ? 's' : ''}}
      </option>
    </select>
    <button
    @click="calculate"
    :disabled="loading"
    class="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50">
    {{loading ? "Calculating..." : "Find optimal period of time"}}
    </button>
    <div v-if="error" class="mt-4 bg-red-100 text-red-700 p-3 rounded">
    {{error}}
    </div>
    <div v-if="result" class="mt-6 bg-green-100 rounded-xl p-4">
      <h3 class="font-bold mb-3">The best period of time to charge your car</h3>
      <p><b>Start:</b>
      {{formatDate(result.start)}}
      </p>
      <p class="mt-2">
      <b>End:</b>
      {{formatDate(result.end)}}
      </p>
      <p class="mt-2">
      <b>Average clean energy:</b>
      {{Number(result.averageCleanPercentage).toFixed(2)}}%
      </p>
    </div>
  </div>
</template>