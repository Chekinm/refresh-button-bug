<script setup>
import { computed } from 'vue';

const props = defineProps({
  countdown: {
    type: Number,
    default: 0,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
  isAutoRefreshEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['refresh']);

const buttonLabel = computed(() => {
  if (props.isRefreshing) {
    return 'Обновление...';
  }

  return 'Обновление через ' + props.countdown + ' сек.';
});

const handleRefresh = () => {
  emit('refresh');
};
</script>

<template>
  <div class="refresh-button-container">
    <button
      @click="handleRefresh"
      :disabled="isRefreshing"
      class="refresh-button"
    >
      <span class="button-text">{{ buttonLabel }}</span>
      <span class="refresh-icon" :class="{ spinning: isRefreshing }"
        >&#128257;</span
      >
    </button>
  </div>
</template>

<style scoped>
.refresh-button-container {
  position: relative;
}

.refresh-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 240px;
  padding: 12px 20px;
  background: white;
  border: 1px solid #3498db;
  border-radius: 6px;
  color: #3498db;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background: #3498db;
  color: white;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-text {
  flex: 1;
  text-align: center;
}

.refresh-icon {
  font-size: 18px;
  display: inline-block;
  transition: transform 0.3s;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
