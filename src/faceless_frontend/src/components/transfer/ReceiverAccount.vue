<script setup lang="ts">
import { ref, computed } from "vue";
import { RouteBack, StatusUpdateButton } from "@/components/community";
import { useFaceless, useReceiverAccount } from "@/store";

const receiverAccount = useReceiverAccount();

const emits = defineEmits(["loadOtherComponent"]);

let account = ref(null);
let mpk = ref(null);

const buttonStatusTheme = computed(() => {
  if (account.value) return "light";
  return "dark";
});

const onUserClickRouteBack = (name: string) => {
  emits("loadOtherComponent", { name });
};

const faceless = useFaceless();
const confirm = async () => {
  receiverAccount.username = account.value;
  receiverAccount.mpk = faceless.client.keypair()?.[1];;
  emits("loadOtherComponent", { name: "TradeAmount" });
};
</script>

<template>
  <div id="ReceiverAccount">
    <div class="logo">
      <img src="@/assets/images/phone.svg" />
    </div>

    <span class="hint"> Please enter the receiver's HRI account. </span>

    <div class="content">
      <div class="item">
        <n-input
          autofocus
          clearable
          :minlength="1"
          placeholder="Enter Username"
          v-model:value="account"
        />
      </div>
      <!-- <div class="item">
        <n-input
          autofocus
          clearable
          :minlength="1"
          placeholder="Enter MPK"
          v-model:value="mpk"
        />
      </div> -->
    </div>

    <div class="btn">
      <StatusUpdateButton
        text="Next"
        :hover="false"
        :theme="buttonStatusTheme"
        @userClickEvent="confirm"
      />
    </div>

    <!-- 返回按钮 -->
    <div class="back">
      <RouteBack name="TradeHRIPlatform" @userClickRouteBack="onUserClickRouteBack" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#ReceiverAccount {
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

  .logo {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    background: #127cf8;
    flex: 0 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 45px;
      height: 45px;
      object-fit: contain;
      flex: 0 0 auto;
    }
  }

  .hint {
    font-size: 17px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    line-height: 17px;
    text-align: center;
    font-family: "Ubuntu-Regular";
    margin-top: 40px;
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
