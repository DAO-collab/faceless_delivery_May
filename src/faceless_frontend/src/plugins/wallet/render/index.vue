<script setup lang="ts">
import { ref } from "vue";
import Web3Provider from "wallet-ethers";
import { notification } from "@/utils/command";
import { output, config, walletIcons } from "@/plugins/wallet/tidy";
import { SwapHorizRound, LogOutRound } from "@vicons/material";
import { useWallet, Connect } from "@/store";
import { omiter } from "@/utils/omit";

const props = defineProps<{
  autoload: boolean;
}>();

let active = ref("");

let walletSymbol = ref("");

let walletPlatform = ref(false);

const Wallet = useWallet();

const emits = defineEmits(["loaded"]);

const openWalletPlatform = () => (walletPlatform.value = true);

const toConnectWallet = async (symbol: string) => {
  try {
    active.value = symbol;

    const initialWallet: any = new Web3Provider(symbol, config[symbol]);

    await initialWallet.login();

    walletSymbol.value = symbol;

    Wallet.connect = initialWallet;

    localStorage.setItem("FLWS", symbol);

    initialWallet.onChainChanged(onWalletChainChange);

    initialWallet.onAccountsChanged(onWalletAccountChange);

    walletPlatform.value = false;

    emits("loaded");

    // 授权完成
  } catch ({ data, message }) {
    // 钱包操作反馈
    notification.error({
      duration: 4000,
      content: "Error",
      meta: (data as any)?.message || message,
    });
  } finally {
    // 初始化激活项
    active.value = "";
  }
};

const onWalletChainChange = async () => {
  location.reload();
};

const onWalletAccountChange = async (account: any) => {
  const params = { connect: { account }, auth: { signature: `` } };
  Wallet.$patch(params);
};

const userSwitchWallet = () => {
  openWalletPlatform();
};

const userSignOut = () => {
  Wallet.connect = {} as Connect;
  Wallet.auth.signature = "";
};

const autoloadCacheMetadata = () => {
  walletSymbol.value = localStorage.getItem("FLWS") || "";
  if (props.autoload && walletSymbol.value) return toConnectWallet(walletSymbol.value);
};

autoloadCacheMetadata();

</script>

<template>
  <div id="wallet">
    <!-- 已连接 -->
    <n-popover
      width="trigger"
      placement="bottom"
      v-if="Wallet.connect.account"
      :show-arrow="false"
      :raw="true"
    >
      <template #trigger>
        <div class="connected">
          <img :src="walletIcons[walletSymbol]?.mainnet" class="mainnet" />
          <img :src="walletIcons[walletSymbol]?.icon" class="icon" />
          {{ omiter(Wallet.connect.account) }}
        </div>
      </template>

      <div id="operate">
        <div class="item" @click="userSwitchWallet">
          <n-icon size="30"> <SwapHorizRound /> </n-icon>
          <span class="name"> Switch Wallet </span>
        </div>

        <div class="item" @click="userSignOut">
          <n-icon size="30"> <LogOutRound /> </n-icon>
          <span class="name"> Sign Out </span>
        </div>
      </div>
    </n-popover>

    <!-- 未连接状态 -->
    <div
      v-else
      class="connecting"
      tabindex="0"
      outline="0"
      hidefocus="true"
      @click="openWalletPlatform"
    >
      <span class="name"> Connect Wallet </span>
    </div>
  </div>

  <!-- 钱包选择平台 -->
  <n-modal v-model:show="walletPlatform" :z-index="10000">
    <div id="model">
      <div class="blockchain" v-for="(it, index) of output" :key="index">
        <div class="chain">
          <img :src="it.icon" :alt="it.name" class="chain_icon" />
          <span class="chain_name"> {{ it.name }} </span>
        </div>

        <div
          :key="n.symbol"
          v-for="n of it.include"
          @click="toConnectWallet(n.symbol)"
          class="wallet"
        >
          <img :src="n.icon" :alt="n.name" class="wallet_icon" />
          <span class="wallet_name"> {{ n.name }} </span>

          <transition mode="out-in" name="coin">
            <n-spin :size="20" v-if="active === n.symbol" />
          </transition>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
#wallet {
  flex: 1;
  display: flex;
  flex-direction: column;

  .connected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(120, 120, 128, 0.2);
    border: 1px solid transparent;
    border-radius: 10px;

    font-size: 17px;
    font-weight: 400;
    color: #ffffff;
    line-height: 17px;
    font-family: "Ubuntu-Medium";

    transition: all 0.5s;

    cursor: pointer;

    .mainnet {
      width: 30px;
      z-index: 2;
    }

    .icon {
      width: 30px;
      margin: 0px 10px 0px -10px;
    }

    &:hover {
      border: 1px solid #0085ff;
      background: rgba(0, 133, 255, 0.2);
    }
  }

  .connecting {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #0085ff;
    border-radius: 10px;

    cursor: pointer;

    .name {
      font-size: 17px;
      font-weight: 500;
      color: #ffffff;
      line-height: 17px;
      font-family: "JosefinSans-Regular";
    }

    &:active {
      transition: all 0.5s;
      transform: translateY(3px) scale(0.98);
    }
  }
}

#operate {
  padding: 10px;
  border-radius: 10px;
  background-color: #27323f;

  .item {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    color: #ffffff99;

    transition: all 0.5s;
    border-radius: 5px;
    cursor: pointer;
    padding: 10px;

    &:hover {
      padding-left: 20px;
      background: rgba(255, 255, 255, 0.2);

      .name {
        opacity: 1;
      }
    }

    .name {
      font-size: 17px;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
      font-family: "Ubuntu-Medium";
      margin-left: 10px;
      transition: all 0.5s;
      opacity: 0.6;
    }
  }
}

#model {
  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  width: 400px;
  background: #1a2736;
  border-radius: 18px;
  padding: 20px;

  .blockchain {
    display: flex;
    flex-direction: column;

    .chain {
      display: flex;
      align-items: center;
      justify-content: center;

      .chain_icon {
        width: 40px;
      }

      .chain_name {
        font-size: 21px;
        font-weight: 500;
        color: #ffffff;
        line-height: 21px;
        font-family: "Ubuntu-Medium";
        margin-left: 10px;
        opacity: 0.9;
      }
    }

    .wallet {
      display: flex;
      align-items: center;

      background: rgba(120, 120, 128, 0.18);
      border-radius: 10px;
      margin-top: 15px;
      padding: 10px;

      transition: all 0.5s;

      cursor: pointer;

      &:hover {
        padding-left: 20px;
        background: rgba(255, 255, 255, 0.2);

        .wallet_name {
          opacity: 1;
        }
      }

      .wallet_icon {
        width: 40px;
      }

      .wallet_name {
        flex: 1;
        font-size: 17px;
        font-weight: 500;
        color: #ffffff;
        line-height: 17px;
        font-family: "JosefinSans-Regular";
        margin-left: 10px;
        transition: all 0.5s;
        opacity: 0.6;
      }
    }
  }
}
</style>
