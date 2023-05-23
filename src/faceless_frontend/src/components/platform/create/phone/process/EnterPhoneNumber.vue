<script setup lang="ts">
import { useUser } from "@/store";
import { ref, computed } from "vue";
import { RouteBack, StatusUpdateButton, areas } from "@/components/community";
import axios from "axios";
import { message } from "@/utils/command";

const emits = defineEmits(["backParentComponent", "loadOtherComponent"]);

const user = useUser();

defineProps<{
  parentComponent: string;
}>();

let loading = ref(false);

let areaCodes = ref(null);

let phoneNumber = ref(null);

const buttonStatusTheme = computed(() => {
  if (areaCodes.value && phoneNumber.value) return "light";
  return "dark";
});

const options: any = ref([]);

const onUserClickRouteBack = (name: string) => {
  emits("backParentComponent", { name });
};

const confirm = async () => {
  user.$patch({ createHRIPlatform: { phone: { areaCodes, phoneNumber } } });
  emits("loadOtherComponent", { name: "EnterCode" });
};

const readAreaCodes = async () => {
  return new Promise(res => {
    setTimeout(() => {
      res(areas);
    }, 3000);
  });
};

const getAreaCodes = async () => {
  loading.value = true;
  options.value = await readAreaCodes();
  loading.value = false;
};

getAreaCodes();

const onlyNumber = (num: string) => {
  return !num || /^\d+$/.test(num);
};
</script>

<template>
  <div id="EnterPhoneNumber">
    <span class="title"> Enter Phone Number </span>

    <span class="hint">
      Please enter your phone number <br />
      to receive a one-time code.
    </span>

    <div class="content">
      <div class="item">
        <n-select
          clearable
          filterable
          label-field="name"
          value-field="key"
          :loading="loading"
          :options="options"
          placeholder="Country/Region"
          v-model:value="areaCodes"
        />
      </div>

      <div class="item">
        <n-input
          autofocus
          clearable
          :minlength="1"
          :allow-input="onlyNumber"
          placeholder="Phone Number"
          v-model:value="phoneNumber"
        />
      </div>
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
      <RouteBack :name="parentComponent" @userClickRouteBack="onUserClickRouteBack" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#EnterPhoneNumber {
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

  .title {
    font-size: 34px;
    font-weight: 600;
    color: #ffffff;
    line-height: 40px;
    text-align: center;
    font-family: "JosefinSans-Medium";
  }

  .hint {
    font-size: 17px;
    font-weight: 400;
    margin-top: 16px;
    color: rgba(255, 255, 255, 0.5);
    font-family: "Ubuntu-Regular";
    text-align: center;
    line-height: 24px;
    margin-bottom: 25px;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .item {
      display: flex;
      flex-direction: column;

      margin-top: 10px;
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
