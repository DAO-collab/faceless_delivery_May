<script setup lang="ts">
import { ref, computed } from "vue";
import { RouteBack, StatusUpdateButton, eras } from "@/components/community";
import phonePlatform from "@/assets/images/phonePlatform.png";
import { useUser, useFaceless } from "@/store";
import { platform_id } from "@/utils/account"; 
import { message } from "@/utils/command";
import axios from "axios";

const emits = defineEmits(["backParentComponent", "loadOtherComponent"]);

const user: any = useUser();
const faceless = useFaceless();

const props = defineProps<{
  frontPage: string;
  parentComponent: string;
}>();

let phoneCode = ref(null);

const buttonStatusTheme = computed(() => {
  if (phoneCode.value) return "light";
  return "dark";
});

const onUserClickRouteBack = (name: string) => {
  emits("loadOtherComponent", { name });
};

const confirm = async () => {
  const username = `+${user.createHRIPlatform.phone.areaCodes}-${user.createHRIPlatform.phone.phoneNumber}`;
  let platform = "Mobile Phone";
  eras[platform_id(platform, username)] = { icon: phonePlatform, platform, username };
  await faceless.client.register("Mobile Phone", username);
  emits("backParentComponent", { name: props.frontPage });
};

const onlyNumber = (num: string) => {
  return !num || /^\d+$/.test(num);
};
</script>

<template>
  <div id="EnterCode">
    <span class="title"> Enter Code </span>

    <span class="hint">
      An authentication code has been sent to <br />
      your mobile phone. Please enter the code to finish the verification.
    </span>

    <div class="content">
      <div class="item">
        <n-input
          autofocus
          clearable
          :minlength="4"
          :allow-input="onlyNumber"
          placeholder="Phone Code"
          v-model:value="phoneCode"
        />
      </div>
    </div>

    <div class="btn">
      <StatusUpdateButton
        text="Confirm"
        :hover="false"
        :theme="buttonStatusTheme"
        @userClickEvent="confirm"
      />
    </div>

    <!-- 返回按钮 -->
    <div class="back">
      <RouteBack name="EnterPhoneNumber" @userClickRouteBack="onUserClickRouteBack" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#EnterCode {
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
      flex: 1;
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
