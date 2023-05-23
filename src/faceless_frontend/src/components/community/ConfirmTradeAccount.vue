<script setup lang="ts">
import { medias } from "./imitate";
import { ref, computed, watch } from "vue";
import { readCoin, readAvatar } from "@/utils/asset";
import { Close, CheckmarkDoneSharp } from "@vicons/ionicons5";
import { StatusUpdateButton } from "@/components/community";
import { useWallet, useReceiverAccount, useFaceless } from "@/store";

let loading = ref(false);

let accounts: any = ref([]);

const wallet = useWallet();

const receiverAccount = useReceiverAccount();

const faceless = useFaceless();

const emits = defineEmits(["closeTradeAccount"]);

const props = defineProps<{
  show: boolean;
  amount: any;
  coin: any;
}>();

let account: any = ref(null);

const readBalance = async (platform: string, username: string) => {
  return await faceless.client.balance(platform, username);
};

const readUserAccounts = async () => {
  return new Promise(res => {
    setTimeout(async () => {
      let values = [];
      for (let id in medias) {
        medias[id].amount = await readBalance(medias[id].platform, medias[id].username);
        values.push(medias[id]);
      }
      res(values);
    }, 3000);
  });
};

const getUserAccounts = async () => {
  loading.value = true;
  accounts.value = await readUserAccounts();
  loading.value = false;
};

const selectTradeAccount = (item: any) => {
  account.value = item;
};

const buttonStatusTheme = computed(() => {
  if (account.value) return "light";
  return "dark";
});

const confirm = async () => {
  await faceless.client.transfer(
    props.amount, 
    account.value.platform, 
    account.value.username,
    receiverAccount.platform,
    receiverAccount.username,
    receiverAccount.mpk);


  download("transfer.txt", `${account.value.username}@${account.value.platform} has transfer ${props.amount} ${props.coin?.name} to ${receiverAccount.username}@${receiverAccount.platform}`)
  emits("closeTradeAccount");
};

const download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const close = () => {
  emits("closeTradeAccount");
};

watch(
  [() => wallet.connect.account, () => props.show, () => props.amount, () => props.coin],

  ([adr, vis, amt, blk]) => {
    if (adr && vis && amt && blk) getUserAccounts();
  },

  { deep: true, immediate: true },
);
</script>

<template>
  <n-modal :show="show" :z-index="10000">
    <div id="ConfirmTradeAccount">
      <n-scrollbar style="max-height: 500px">
        <div class="content">
          <div class="head">
            <div class="close" @click="close">
              <n-icon :size="21" color="#FFFFFF99">
                <Close />
              </n-icon>
            </div>
          </div>

          <div class="params">
            <div class="center">
              <img :src="readCoin(coin?.icon)" class="icon" />

              <div class="amount">
                <n-number-animation show-separator :precision="2" :to="Number(amount)" />
              </div>

              <span class="name">
                {{ coin?.name }}
              </span>
            </div>
          </div>

          <n-spin :show="loading" size="large" description="Loading accounts">
            <div class="list">
              <!-- 账号列表 -->
              <XyzTransitionGroup appear-visible xyz="fade small-3 down-25% stagger-1.5">
                <div class="item" v-for="it of accounts" :key="it" @click="selectTradeAccount(it)">
                  <div class="avatar">
                    <img :src="readAvatar(it.avatar)" />
                  </div>

                  <div class="info">
                    <div class="info_account">
                      <span class="username"> {{ it.username }} </span>
                      <span class="platform"> {{ it.platform }} </span>
                    </div>

                    <div :class="[`info_opt`, { info_opt_done: it.key === account?.key }]">
                      <div :class="[`money`, { noSeles: amount > it.amount }]">
                        <span class="amount"> {{ it.amount }} </span>
                        <span class="coin"> {{ it.coin }} </span>
                      </div>

                      <div class="done">
                        <n-icon color="#0085FF" :size="20">
                          <CheckmarkDoneSharp />
                        </n-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </XyzTransitionGroup>

              <!-- 无数据 -->
              <div class="noData" v-if="!loading && !accounts.length">
                <n-empty description="No account yet" />
              </div>
            </div>
          </n-spin>
        </div>
      </n-scrollbar>

      <div class="operate">
        <StatusUpdateButton
          text="Confirm"
          :hover="false"
          :theme="buttonStatusTheme"
          @userClickEvent="confirm"
        />
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
#ConfirmTradeAccount {
  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  width: 400px;
  background: #1a2736;
  border-radius: 12px;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .head {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      top: 0px;
      position: sticky;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #3c3c435c;
      border-top-right-radius: 12px;
      border-top-left-radius: 12px;

      padding: 20px 16px;

      overflow: hidden;

      z-index: 1;

      .close {
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;

        width: 30px;
        height: 30px;
        background: rgba(118, 118, 128, 0.12);
        border-radius: 100%;

        transition: all 0.5s;

        &:hover {
          transform: rotate(180deg) scale(1.22);
        }

        &:active {
          transform: rotate(180deg) scale(0.85);
        }
      }
    }

    .params {
      display: flex;
      align-items: center;
      justify-content: center;

      margin: 40px 0px;

      top: 14px;
      position: sticky;
      pointer-events: none;

      z-index: 2;

      .center {
        display: flex;
        align-items: flex-end;

        .icon {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 100%;
          flex: 0 0 auto;
        }

        .amount {
          font-size: 48px;
          font-weight: 600;
          color: #ffffff;
          line-height: 44px;
          font-family: "Ubuntu-Medium";
          margin: 0px 8px;
        }

        .name {
          font-size: 17px;
          font-weight: 400;
          color: #ffffff;
          line-height: 22px;
          font-family: "Ubuntu-Regular";
          opacity: 0.5;
        }
      }
    }

    .list {
      flex: 1;
      display: flex;
      flex-direction: column;

      min-height: 200px;

      padding: 0px 6px;

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        transition: all 0.5s;
        padding: 0px 10px;
        cursor: pointer;

        &:hover {
          border-radius: 10px;
          background: #ffffff1a;
          transform: scale(0.97);

          .info {
            border-bottom: 1px solid transparent;
          }
        }

        &:active {
          transform: scale(0.92);
        }

        &:last-child .info {
          border-bottom: none;
        }

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          width: 40px;
          height: 40px;
          border-radius: 8px;
          overflow: hidden;

          background: rgba(118, 118, 128, 0.32);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            flex: 0 0 auto;
          }
        }

        .info {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-left: 12px;
          border-bottom: 1px solid #ffffff1a;
          transition: all 0.5s;

          padding: 10px 0px;

          overflow: hidden;

          .info_account {
            flex: 1;
            display: flex;
            flex-direction: column;

            .username {
              font-size: 17px;
              font-weight: 400;
              color: #ffffff;
              line-height: 17px;
              font-family: "Ubuntu-Regular";
              opacity: 0.9;
            }

            .platform {
              font-size: 15px;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.5);
              line-height: 15px;
              font-family: "JosefinSans-Regular";
              margin-top: 8px;
            }
          }

          .info_opt {
            display: flex;
            align-items: center;
            justify-content: space-between;

            transform: translateX(35px);

            transition: all 0.5s;

            .money {
              display: flex;
              align-items: center;
              justify-content: center;

              .amount {
                font-size: 17px;
                font-weight: 400;
                color: #ffffff;
                line-height: 17px;
                font-family: "Ubuntu-Regular";
                transition: all 0.5s;
                opacity: 0.3;
              }

              .coin {
                font-size: 17px;
                font-weight: 400;
                color: #ffffff;
                line-height: 17px;
                font-family: "Ubuntu-Regular";
                margin-left: 5px;
                opacity: 0.3;
              }
            }

            .noSeles {
              display: flex;
              align-items: center;
              justify-content: center;

              .amount {
                color: #ca5353 !important;
                text-decoration: line-through;
              }
            }

            .done {
              display: flex;
              align-items: center;
              justify-content: center;

              margin-left: 15px;
            }
          }

          .info_opt_done {
            transform: translateX(0px);
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
  }

  .operate {
    height: 48px;
    padding: 16px;
    flex: 0 0 auto;

    display: flex;
    flex-direction: column;
  }
}
</style>
