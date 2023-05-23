<script setup lang="ts">
import { useWallet } from "@/store";
import ConnectWallet from "@/plugins/wallet/render/index.vue";

const wallet = useWallet();

const emits = defineEmits(["userClickEvent"]);

defineProps<{
  text: string;
  theme: string;
  hover: boolean;
}>();

const userConfirm = () => {
  emits("userClickEvent");
};
</script>

<template>
  <div id="StatusUpdateButton">
    <transition appear mode="out-in" name="button">
      <!-- 行为按钮 -->
      <div class="regular" v-if="wallet.connect.account">
        <div :class="[`btn`, theme, { hover }]" @click="userConfirm">
          {{ text }}
        </div>
      </div>

      <!-- 连接钱包 -->
      <div class="unusual" v-else>
        <ConnectWallet :autoload="false" />
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#StatusUpdateButton {
  flex: 1;
  display: flex;
  flex-direction: column;

  .unusual {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .regular {
    flex: 1;
    display: flex;
    flex-direction: column;

    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 10px;
      transition: all 0.5s;

      font-size: 17px;
      font-weight: 500;
      color: #ffffff;
      line-height: 17px;
      font-family: "Ubuntu-Medium";

      cursor: pointer;

      &:active {
        transform: translateY(3px) scale(0.98);
      }
    }

    .light {
      background: #0085ff;
    }

    .dark {
      background: rgba(120, 120, 128, 0.18);
    }

    .hover:hover {
      background: #0085ff;
    }
  }
}
</style>
