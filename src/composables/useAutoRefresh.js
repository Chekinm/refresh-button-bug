import { ref, onMounted, onUnmounted } from 'vue';

export function useAutoRefresh(refreshCallback, intervalMs = 10000) {
  const countdown = ref(Math.floor(intervalMs / 1000));
  const isAutoRefreshEnabled = ref(true);

  let countdownTimer = null;

  const startCountdown = () => {
    if (!isAutoRefreshEnabled.value) return;

    countdown.value = Math.floor(intervalMs / 1000);

    countdownTimer = setInterval(() => {
      countdown.value--;

      if (countdown.value <= 0) {
        executeRefresh();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  };

  const executeRefresh = async () => {
    stopCountdown();

    try {
      await refreshCallback();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      if (isAutoRefreshEnabled.value) {
        startCountdown();
      }
    }
  };

  const manualRefresh = () => {
    executeRefresh();
  };

  const toggleAutoRefresh = () => {
    isAutoRefreshEnabled.value = !isAutoRefreshEnabled.value;

    if (isAutoRefreshEnabled.value) {
      startCountdown();
    } else {
      stopCountdown();
      countdown.value = 0;
    }
  };

  onMounted(() => {
    startCountdown();
  });

  onUnmounted(() => {
    stopCountdown();
  });

  return {
    countdown,
    isAutoRefreshEnabled,
    manualRefresh,
  };
}
