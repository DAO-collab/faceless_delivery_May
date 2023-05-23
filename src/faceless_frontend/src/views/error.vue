<script setup lang="ts">
import { useRouter } from "vue-router";

const { push } = useRouter();

const home = () => push({ name: "home" });
</script>

<template>
  <div id="error">
    <div class="content">
      <img src="@/assets/images/error.svg" />
      <span class="hint"> Oops! This page could not be found. </span>
      <n-button strong secondary round type="warning" @click="home"> Back to Homepage </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    display: flex;
    align-items: center;
    flex-direction: column;

    img {
      width: 400px;
    }

    .hint {
      font-size: 17px;
      color: #0085ff;
      font-weight: bold;
      line-height: 17px;
      margin: 40px 0px;
    }
  }
}
</style>
