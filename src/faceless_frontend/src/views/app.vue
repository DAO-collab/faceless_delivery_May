<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConnectWallet from "@/plugins/wallet/render/index.vue";
import { useFaceless, initializeFaceless } from "@/store";
import { useConfig } from "@/store";



let currentRoute = ref("wallet");

const { push } = useRouter();

const toRoute = (route: string) => {
  currentRoute.value = route;
  push(`/${route}`);
};

let address = ref(null);
const config = useConfig();
const faceless = useFaceless();


const init = async () => {
    await initializeFaceless();
    address.value = faceless.client.wallet_address();
    console.log("app.vue dfinity client: ", faceless.client);
}
init();

// if (config.backend == "polkadot") {
//   const substrate = useSubstrate();
//   const init = async () => {
//     substrate.client = await initSubstrateFaceless();
//     address.value = substrate.client.account.address;
//   }
//   init();
// }
// else if (config.backend == "dfinity") {
//   const dfinity = useDfinity();
//   const init = async () => {
//     dfinity.client = await initDfinityFaceless();
//     console.log("app.vue dfinity client: ", dfinity.client);
//   }
//   init();
// }

</script>

<template>
  <div id="app">
    <div class="head">
      <div class="logo">
        <img src="@/assets/images/logo.svg" alt="logo" />
      </div>

      <div class="swap">
        <div :class="[`swap_content`, currentRoute]">
          <span class="swap_item" @click="toRoute(`wallet`)"> HRI Wallets </span>
          <!-- Zico: The transfer tab should only appears after selecting an account, otherwise how do we decide the sender? -->
          <span class="swap_item" @click="toRoute(`transfer`)"> Transfer </span>
          <span class="piece" />
        </div>
      </div>

      <div class="connect">
        <div class="btn">
          <ConnectWallet :autoload="true" />
        </div>
      </div>
    </div>

    <div class="content">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in" name="app">
          <component :is="Component" />
        </transition>
      </router-view>
      <div v-if="address">
        <p><span class="info"> Wallet address: {{ address }} </span></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  flex: 1;
  display: flex;
  flex-direction: column;

  padding-bottom: 16px;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    top: 0;
    position: sticky;
    backdrop-filter: blur(7px);
    padding: 16px;
    z-index: 3;

    .logo {
      flex: 1;
      display: flex;
      align-items: center;

      img {
        width: 120px;
      }
    }

    .connect {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        display: flex;
        flex-direction: column;

        width: 210px;
        height: 40px;
      }
    }

    .swap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .swap_content {
        width: 240px;
        height: 40px;
        background: rgba(120, 120, 128, 0.18);
        border-radius: 50px;

        display: flex;
        position: relative;
        justify-content: space-between;

        overflow: hidden;

        .swap_item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          font-family: "Ubuntu-Regular";
          line-height: 15px;

          transition: all 0.5s;
          cursor: pointer;
          z-index: 1;
        }

        .piece {
          left: 0px;
          width: 120px;
          height: 40px;
          position: absolute;
          background: #0085ff;
          transition: all 0.5s;
          border-radius: 50px;
        }
      }

      .wallet {
        span:nth-child(1) {
          color: #ffffff;
        }

        span:last-child {
          animation: walletRubberBand 1s forwards;
        }
      }

      .transfer {
        span:nth-child(2) {
          color: #ffffff;
        }

        span:last-child {
          animation: transferRubberBand 1s forwards;
        }
      }
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }

  .info {
      font-size: 17px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      line-height: 17px;
      font-family: "Ubuntu-Regular";
      margin-left: 10px;
  }
}

@keyframes walletRubberBand {
  from {
    left: 120px;
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    left: 0px;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes transferRubberBand {
  from {
    left: 0px;
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    left: 120px;
    transform: scale3d(1, 1, 1);
  }
}
</style>
