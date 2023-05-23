<script setup lang="ts">
import { ref, watch } from "vue";
import { useWallet, useAccount } from "@/store";
import { StatusUpdateButton, eras } from "@/components/community";

let loading = ref(false);

let accounts: any = ref([]);

const wallet = useWallet();

const account = useAccount();

const emits = defineEmits(["loadOtherComponent"]);

const readUserAccounts = async () => {
  return new Promise(res => {
    setTimeout(() => {
      let accs = [];
      for (let id in eras) {
        accs.push(eras[id]);
      }
      res(accs);
    }, 1000);
  });
};

const getUserAccounts = async () => {
  loading.value = true;
  accounts.value = await readUserAccounts();
  loading.value = false;
};

const confirm = async () => {
  emits("loadOtherComponent", { name: "AddHRIPlatform" });
};

const toAccountItem = (accountItem: object) => {
  account.$patch(accountItem);
  emits("loadOtherComponent", { name: "AccountItem" });
};

watch(
  () => wallet.connect.account,
  adr => {
    if (adr) getUserAccounts();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div id="AccountList">
    <span class="title">
      A new era of <br />
      crypto payments
    </span>

    <n-scrollbar trigger="none" style="max-height: 500px">
      <n-spin :show="loading" size="large" description="Loading accounts">
        <div class="content">
          <!-- 账号列表 -->
          <XyzTransitionGroup appear-visible xyz="fade small-3 down-25% stagger-1.5">
            <div class="item" v-for="it of accounts" :key="it" @click="toAccountItem(it)">
              <span class="type"> {{ it.platform }} </span>
              <span class="account"> {{ it.username }} </span>
              <img :src="it.icon" />
            </div>
          </XyzTransitionGroup>

          <!-- 无数据 -->
          <div class="noData" v-if="!loading && !accounts.length">
            <n-empty description="No account yet" />
          </div>
        </div>
      </n-spin>
    </n-scrollbar>

    <div class="btn">
      <StatusUpdateButton
        text="Add New Account"
        theme="dark"
        :hover="true"
        @userClickEvent="confirm"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#AccountList {
  flex: 0;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  width: 550px;
  overflow: hidden;
  border-radius: 18px;
  background-color: #1a2736;

  padding: 75px 100px;

  .title {
    font-size: 37px;
    font-weight: 600;
    color: #ffffff;
    line-height: 40px;
    text-align: center;
    font-family: "JosefinSans-Medium";
    margin-bottom: 25px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    min-height: 200px;

    .item {
      display: flex;
      flex-direction: column;
      position: relative;

      height: 135px;
      margin-bottom: 10px;
      border-radius: 10px;
      overflow: hidden;

      transition: all 0.5s;
      cursor: pointer;

      &:hover {
        transform: scale(0.96);
      }

      &:active {
        transform: scale(0.92);
      }

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
      }

      .type {
        font-size: 15px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.5);
        line-height: 15px;
        font-family: "JosefinSans-Regular";
        padding: 0px 16px;
        margin-top: 16px;
        z-index: 1;
      }

      .account {
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        line-height: 24px;
        font-family: "Ubuntu-Medium";
        padding: 0px 16px;
        margin-top: 8px;
        z-index: 1;
      }
    }

    .noData {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .btn {
    height: 48px;
    margin-top: 20px;

    display: flex;
    flex-direction: column;
  }
}
</style>
