<script setup lang="ts">
import { ref, watch } from "vue";
import { useWallet, useAccount, useFaceless } from "@/store";
import { RouteBack, StatusUpdateButton } from "@/components/community";

let currentQueryType = ref("history");

let historyLoading = ref(false);

let tokensLoading = ref(false);

let historys: any = ref([]);

let tokens: any = ref([]);

let balance: any = ref(0);

const wallet = useWallet();

const account = useAccount();

const faceless = useFaceless();

const emits = defineEmits(["loadOtherComponent"]);


const readAccountHistoryTradeRecords = async () => {
  return new Promise(res => {
    setTimeout(() => {
      res([1, 2]);
    }, 3000);
  });
};

const readAccountTokensOperateRecords = async () => {
  return new Promise(res => {
    setTimeout(() => {
      res([1, 2]);
    }, 3000);
  });
};

const getUserOperateRecords = async (type: string) => {
  switch (type) {
    case "history":
      historyLoading.value = true;
      historys.value = await readAccountHistoryTradeRecords();
      historyLoading.value = false;

      break;

    case "tokens":
      tokensLoading.value = true;
      tokens.value = await readAccountTokensOperateRecords();
      tokensLoading.value = false;

      break;
  }
};

const depositConfirm = async () => {
  emits("loadOtherComponent", { name: "DepositToken" });
};

const withdrawConfirm = async () => {
  emits("loadOtherComponent", { name: "WithdrawToken" });
};

const onUserClickRouteBack = (name: string) => {
  emits("loadOtherComponent", { name });
};

watch(
  () => wallet.connect.account,
  adr => {
    if (adr) getUserOperateRecords(currentQueryType.value);
  },
  { deep: true, immediate: true },
);

const readBalance = async () => {
  balance.value = await faceless.client.balance(account.platform, account.username);
};

readBalance();

</script>

<template>
  <div id="AccountItem">
    <!-- 返回按钮 -->
    <div class="back">
      <RouteBack name="AccountList" @userClickRouteBack="onUserClickRouteBack" />
    </div>

    <img src="@/assets/images/account.png" class="userAvatar" />

    <!-- <div class="info">
      <img src="@/assets/images/symbol.svg" class="symbol" />
      <span class="symbol_name"> @Hellohuman </span>
    </div>

    <div class="wealth">$<n-number-animation show-separator :precision="2" :to="1784.75" /></div> -->

    <div class="info">
      <img :src="account.icon" class="symbol" />
      <span class="symbol_name"> {{ account.platform }} </span>
      <span class="symbol_name"> {{ account.username }} </span>
    </div>

    <div class="wealth"><n-number-animation show-separator :precision="2" :to="balance" /></div>

    <div class="content">
      <div class="deposit">
        <StatusUpdateButton
          text="Deposit"
          theme="light"
          :hover="false"
          @userClickEvent="depositConfirm"
        />
      </div>

      <div class="withdraw">
        <StatusUpdateButton
          text="Withdraw"
          theme="dark"
          :hover="false"
          @userClickEvent="withdrawConfirm"
        />
      </div>

      <div class="list">
        <n-tabs animated v-model:value="currentQueryType" @update:value="getUserOperateRecords">
          <n-tab-pane display-directive="show:lazy" name="history">
            <div class="history_record">
              <!-- 历史列表 -->
              <XyzTransitionGroup appear-visible xyz="fade small-3 down-25% stagger-1.5">
                <div class="item" v-for="it of historys" :key="it">
                  <img src="@/assets/images/user.png" class="avatar" />

                  <div class="item_info">
                    <div class="item_info_call">
                      <span class="call_name"> @Teatrrrraloo </span>
                      <span class="call_platform"> Twitter </span>
                    </div>

                    <span class="money"> -$12.00 </span>
                  </div>
                </div>
              </XyzTransitionGroup>

              <!-- 无数据 -->
              <div class="noData" v-if="!historys.length">
                <n-empty description="No history yet" />
              </div>
            </div>

            <template #tab>
              <div class="tab_head">
                <span class="tab_head_name"> History </span>
                <n-spin :size="15" v-if="historyLoading" />
              </div>
            </template>
          </n-tab-pane>

          <n-tab-pane display-directive="show:lazy" name="tokens">
            <div class="tokens_record">
              <!-- 历史列表 -->
              <XyzTransitionGroup appear-visible xyz="fade small-3 down-25% stagger-1.5">
                <div class="item" v-for="it of tokens" :key="it">
                  <img src="@/assets/images/eth.svg" class="avatar" />

                  <div class="item_info">
                    <div class="item_info_call">
                      <span class="call_name"> ETH </span>
                      <span class="call_platform"> Ethereum Token </span>
                    </div>

                    <span class="money"> 2.5328 </span>
                  </div>
                </div>
              </XyzTransitionGroup>

              <!-- 无数据 -->
              <div class="noData" v-if="!tokens.length">
                <n-empty description="No token yet" />
              </div>
            </div>

            <template #tab>
              <div class="tab_head">
                <span class="tab_head_name"> Tokens </span>
                <n-spin :size="15" v-if="tokensLoading" />
              </div>
            </template>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#AccountItem {
  flex: 0;
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  overflow-y: scroll;

  width: 550px;
  border-radius: 18px;
  background-color: #1a2736;

  max-height: 830px;

  .back {
    display: flex;
    flex-direction: column;

    margin-left: 16px;
    margin-top: 16px;

    top: 16px;
    position: sticky;
    z-index: 2;
  }

  .userAvatar {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    object-fit: cover;
    margin-top: 60px;
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

    padding: 18px 0px;

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

  .wealth {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 34px;
    font-weight: 600;
    color: #ffffff;
    line-height: 34px;
    font-family: "Ubuntu-Medium";
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    padding: 0px 100px;

    .deposit {
      height: 48px;
      margin-top: 25px;

      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
    }

    .withdraw {
      height: 48px;
      margin-top: 10px;

      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
    }

    .list {
      flex: 1;
      display: flex;
      flex-direction: column;

      margin-top: 35px;
      padding-bottom: 20px;

      .history_record {
        flex: 1;
        display: flex;
        flex-direction: column;

        min-height: 200px;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;

          transition: all 0.5s;
          cursor: pointer;

          &:last-child .item_info {
            border-bottom: none;
          }

          &:hover {
            transform: scale(0.96);
          }

          &:active {
            transform: scale(0.92);
          }

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
            overflow: hidden;
          }

          .item_info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            border-bottom: 1px solid rgba(120, 120, 128, 0.45);

            margin-left: 12px;

            padding: 10px 0px;

            .item_info_call {
              display: flex;
              flex-direction: column;

              .call_name {
                font-size: 17px;
                font-weight: 400;
                color: #ffffff;
                line-height: 17px;
                font-family: "Ubuntu-Regular";
              }

              .call_platform {
                font-size: 15px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.5);
                line-height: 15px;
                font-family: "JosefinSans-Regular";
                margin-top: 10px;
              }
            }

            .money {
              font-size: 17px;
              font-weight: 400;
              color: #ffffff;
              line-height: 17px;
              font-family: "Ubuntu-Medium";
            }
          }
        }

        .noData {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .tokens_record {
        flex: 1;
        display: flex;
        flex-direction: column;

        min-height: 200px;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;

          transition: all 0.5s;
          cursor: pointer;

          &:last-child .item_info {
            border-bottom: none;
          }

          &:hover {
            transform: scale(0.96);
          }

          &:active {
            transform: scale(0.92);
          }

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
            overflow: hidden;
          }

          .item_info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;

            border-bottom: 1px solid rgba(120, 120, 128, 0.45);

            margin-left: 12px;

            padding: 10px 0px;

            .item_info_call {
              display: flex;
              flex-direction: column;

              .call_name {
                font-size: 17px;
                font-weight: 400;
                color: #ffffff;
                line-height: 17px;
                font-family: "Ubuntu-Regular";
              }

              .call_platform {
                font-size: 15px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.5);
                line-height: 15px;
                font-family: "JosefinSans-Regular";
                margin-top: 10px;
              }
            }

            .money {
              font-size: 17px;
              font-weight: 400;
              color: #ffffff;
              line-height: 17px;
              font-family: "Ubuntu-Medium";
            }
          }
        }

        .noData {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .tab_head {
        width: 75px;
        display: flex;
        align-items: center;
        justify-content: center;

        transition: all 0.5s;

        .tab_head_name {
          font-size: 15px;
          font-weight: 600;
          line-height: 15px;
          font-family: "Ubuntu-Regular";
          transition: all 0.5s;
          margin-right: 7px;
        }
      }
    }
  }
}
</style>
