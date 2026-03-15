import { ref, watch } from 'vue';

export function useThrottle<T>(value: Ref<T>, delay = 500) {
  const throttledValue = ref<T>(value.value);
  let lastRan = 0;
  let timer: NodeJS.Timeout | undefined;

  watch(value, (newVal) => {
    const now = Date.now();

    clearTimeout(timer);

    if (now - lastRan >= delay) {
      throttledValue.value = newVal;
      lastRan = now;
    } else {
      // Ensure the very last change is captured
      timer = setTimeout(() => {
        throttledValue.value = newVal;
        lastRan = Date.now();
      }, delay - (now - lastRan));
    }
  });

  return throttledValue;
}