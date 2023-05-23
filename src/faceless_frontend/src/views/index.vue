<script setup lang="ts">
import { useRouter } from "vue-router";
import ConnectWallet from "@/plugins/wallet/render/index.vue";

const { push } = useRouter();

const onloaded = () => push("/wallet");
</script>

<template>
  <div id="index">
    <div class="bg">
      <img src="@/assets/images/logo.svg" alt="logo" class="logo" />

      <div class="content">
        <span class="name">
          A Cross-Platform <br />
          Private Payment Scheme <br />
          for HRI
        </span>

        <span class="hint">
          A Cross-Platform Private Payment Scheme <br />
          for Human-Readable Identifiers.
        </span>

        <div class="btn">
          <ConnectWallet :autoload="true" @loaded="onloaded" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#index {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/images/bg.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  .bg {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.5);

    padding: 16px;

    .logo {
      width: 120px;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .name {
        font-size: 60px;
        font-weight: 600;
        color: #ffffff;
        line-height: 66px;
        font-family: "Ubuntu-Medium";
        text-align: center;
      }

      .hint {
        font-size: 17px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
        line-height: 22px;
        font-family: "JosefinSans-Medium";
        text-align: center;
        margin-top: 16px;
      }

      .btn {
        width: 343px;
        height: 48px;
        display: flex;
        flex-direction: column;
        margin-top: 40px;
      }
    }
  }
}
</style>
