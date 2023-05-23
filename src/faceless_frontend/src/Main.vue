<script setup lang="ts">
import { darkTheme } from "naive-ui";
import { useRouter } from "vue-router";
import { onErrorCaptured, computed } from "vue";
import darkConfig from "@/assets/style/overrides/dark.json";

onErrorCaptured(() => {
  push({ path: "/" }).finally(() => {
    window.location.reload();
  });
});

const { push } = useRouter();
const _ = (n: any) => (document.documentElement.className = n);
const kind = computed(() => "theme-dark");
_(kind.value);
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="darkConfig">
    <n-notification-provider>
      <n-loading-bar-provider>
        <n-message-provider>
          <div id="main">
            <router-view v-slot="{ Component }">
              <transition appear mode="out-in" name="main">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
#main {
  display: flex;
  min-width: auto;
  min-height: 100vh;
  flex-direction: column;
  background-color: #151e28;
}
</style>
