<script setup lang="ts">
import { ref } from "vue";
import { EnterPhoneNumber, EnterCode } from "./process";

let currentBusinessComponent = ref("EnterPhoneNumber");

const emits = defineEmits(["loadOtherComponent"]);

const phoneBusinessComponents: any = {
  EnterPhoneNumber,
  EnterCode,
};

interface LoadOtherComponentParams {
  name: string;
}

const loadOtherComponent = ({ name }: LoadOtherComponentParams) => {
  currentBusinessComponent.value = name;
};

const backParentComponent = ({ name }: LoadOtherComponentParams) => {
  emits("loadOtherComponent", { name });
};
</script>

<template>
  <div id="phone">
    <transition mode="out-in" name="phone">
      <component
        frontPage="AccountList"
        parentComponent="AddHRIPlatform"
        @backParentComponent="backParentComponent"
        :is="phoneBusinessComponents[currentBusinessComponent]"
        @loadOtherComponent="loadOtherComponent"
      />
    </transition>
  </div>
</template>

<style lang="scss" scoped>
#phone {
  flex: 0;
  display: flex;
  flex-direction: column;
}
</style>
