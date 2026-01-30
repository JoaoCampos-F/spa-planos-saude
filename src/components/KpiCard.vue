<template>
  <div class="kpi-card rounded-lg">
    <div class="kpi-label-section">
      <small class="kpi-label">{{ label }}</small>
      <h3
        :class="`kpi-amount ${
          secondary ? 'text-secondary' : 'text-primary'
        } ma-0 pa-0`"
      >
        {{ amount }}
      </h3>
    </div>
    <div class="kpi-chart-section">
      <canvas class="rounded-lg" ref="chart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  label: { type: String, required: true },
  amount: { type: [Number, String], required: true },
  values: { type: Array, required: true },
  secondary: { type: Boolean, default: false },
});

const chart = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(chart.value, {
    type: "line",
    data: {
      labels: props.values.map((_, i) => i + 1),
      datasets: [
        {
          data: props.values,
          borderColor: props.secondary ? "#43CED7" : "#1976d2",
          backgroundColor: props.secondary
            ? "rgba(67, 206, 215, 0.1)"
            : "rgba(25, 118, 210, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    },
  });
};

onMounted(renderChart);
watch(() => props.values, renderChart);
</script>

<style scoped>
.kpi-card {
  display: flex;
  align-items: center;
  background: transparent;
  min-width: 200px;
}
.kpi-label-section {
  display: flex;
  flex-direction: column;
  margin-right: 24px;
  min-width: 80px;
}
.kpi-label {
  color: #999;
  font-weight: 400;
}
.kpi-amount {
  font-weight: 600;
}
.kpi-chart-section {
  flex: 1;
  min-width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
}
.kpi-chart-section canvas {
  width: 100% !important;
  height: 60px !important;
}
</style>
