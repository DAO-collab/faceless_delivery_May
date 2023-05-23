<script setup lang="ts">
import {
  RouteBack,
  StatusUpdateButton,
  SelectCoin,
  ConfirmTradeAccount,
} from "@/components/community";

import { ref, computed } from "vue";

const emits = defineEmits(["loadOtherComponent"]);

let coin = ref(null);

let amount = ref(null);

let selectTradeAccount = ref(false);

const buttonStatusTheme = computed(() => {
  if (amount.value && coin.value) return "light";
  return "dark";
});

const onUserClickRouteBack = (name: string) => {
  emits("loadOtherComponent", { name });
};

const confirm = async () => {
  selectTradeAccount.value = true;
};

const onCloseTradeAccount = () => {
  selectTradeAccount.value = false;
};

const onlyNumber = (num: string) => {
  return !num || /^\d+$/.test(num);
};
</script>

<template>
  <div id="TradeAmount">
    <img src="@/assets/images/user.png" class="userAvatar" />

    <div class="info">
      <img src="@/assets/images/symbol.svg" class="symbol" />
      <span class="symbol_name"> @Teatrrrraloo </span>
    </div>

    <div class="coin">
      <SelectCoin v-model:coin="coin" />
    </div>

    <div class="content">
      <div class="item">
        <n-input
          autofocus
          clearable
          :minlength="1"
          :allow-input="onlyNumber"
          placeholder="Enter Amount"
          v-model:value="amount"
        />
      </div>
    </div>

    <div class="btn">
      <StatusUpdateButton
        text="Transfer"
        :hover="false"
        :theme="buttonStatusTheme"
        @userClickEvent="confirm"
      />
    </div>

    <!-- 返回按钮 -->
    <div class="back">
      <RouteBack name="ReceiverAccount" @userClickRouteBack="onUserClickRouteBack" />
    </div>

    <!-- 选择交易账户平台 -->
    <ConfirmTradeAccount
      :amount="amount"
      :show="selectTradeAccount"
      @closeTradeAccount="onCloseTradeAccount"
      :coin="coin"
    />
  </div>
</template>

<style lang="scss" scoped>
#TradeAmount {
  flex: 0;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  width: 550px;
  overflow: hidden;
  border-radius: 18px;
  background-color: #1a2736;

  padding: 75px 100px;

  position: relative;

  .userAvatar {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    object-fit: cover;
    flex: 0 0 auto;
  }

  .info {
    top: 0px;
    position: sticky;
    backdrop-filter: blur(10px);
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: 18px;

    .symbol {
      width: 20px;
      height: 20px;
      border-radius: 100%;
      object-fit: contain;
    }

    .symbol_name {
      font-size: 17px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      line-height: 17px;
      font-family: "Ubuntu-Regular";
      margin-left: 10px;
    }
  }

  .coin {
    flex: 1;
    display: flex;
    flex-direction: column;

    margin-top: 35px;
  }

  .content {
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      flex-direction: column;

      margin-top: 30px;
    }
  }

  .btn {
    height: 48px;
    margin-top: 28px;

    display: flex;
    flex-direction: column;
  }

  .back {
    top: 16px;
    left: 16px;
    position: absolute;

    display: flex;
    flex-direction: column;
  }
}
</style>
