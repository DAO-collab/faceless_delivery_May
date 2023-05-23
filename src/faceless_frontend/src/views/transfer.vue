<script setup lang="ts">
import { ref } from "vue";
import { TradeHRIPlatform, ReceiverAccount, TradeAmount } from "@/components/transfer";

let currentBusinessComponent = ref("TradeHRIPlatform");

const transferBusinessComponents: any = {
  TradeHRIPlatform,
  ReceiverAccount,
  TradeAmount,
};

interface LoadOtherComponentParams {
  name: string;
}

const loadOtherComponent = ({ name }: LoadOtherComponentParams) => {
  currentBusinessComponent.value = name;
};
</script>

<template>
  <div id="transfer">
    <transition mode="out-in" name="transfer">
      <component
        :is="transferBusinessComponents[currentBusinessComponent]"
        @loadOtherComponent="loadOtherComponent"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#transfer {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
