<script setup lang="ts">
import {
  AccountList,
  AccountItem,
  AddHRIPlatform,
  DepositToken,
  WithdrawToken,
} from "@/components/wallet";

import { ref } from "vue";
import { MPhone } from "@/components/platform/create";

let currentBusinessComponent = ref("AccountList");

const walletBusinessComponents: any = {
  AccountList,
  AccountItem,
  AddHRIPlatform,
  MPhone,
  DepositToken,
  WithdrawToken,
};

interface LoadOtherComponentParams {
  name: string;
}

const loadOtherComponent = ({ name }: LoadOtherComponentParams) => {
  currentBusinessComponent.value = name;
};
</script>

<template>
  <div id="wallet">
    <transition mode="out-in" name="wallet">
      <component
        :is="walletBusinessComponents[currentBusinessComponent]"
        @loadOtherComponent="loadOtherComponent"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#wallet {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
