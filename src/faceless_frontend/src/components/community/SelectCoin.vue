<script setup lang="ts">
import { ref, watch } from "vue";
import { useWallet } from "@/store";
import { filter, cloneDeep } from "lodash-es";
import { HandClick, ListSearch } from "@vicons/tabler";
import { tokens } from "./imitate";

const wallet = useWallet();

const emits = defineEmits(["update:coin"]);

defineProps<{
  coin: any;
}>();

let show = ref(false);

let searchLoading = ref(false);

let loadCoinsLoading = ref(false);

let coins: any = ref([]);

let cacheCoins: any = ref([]);

const readCoins = async () => {
  return new Promise(res => {
    setTimeout(() => {
      res(tokens);
    }, 3000);
  });
};

const getCoins = async () => {
  loadCoinsLoading.value = true;
  cacheCoins.value = await readCoins();
  coins.value = cloneDeep(cacheCoins.value);
  loadCoinsLoading.value = false;
};

const userSearchValue = (searchValue: string) => {
  try {
    searchLoading.value = true;
    if (!searchValue) return (coins.value = cacheCoins.value);
    const fun = (it: any) => it.name.toLowerCase().includes(searchValue.toLowerCase());
    coins.value = filter(cacheCoins.value, fun);
  } finally {
    searchLoading.value = false;
  }
};

const userConfirmCoin = (item: any) => {
  emits("update:coin", item);
  show.value = false;
};

watch(
  () => wallet.connect.account,
  adr => {
    if (adr) getCoins();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div id="SelectCoin">
    <div class="content">
      <n-popover
        scrollable
        placement="bottom"
        :show-arrow="false"
        v-model:show="show"
        display-directive="show"
      >
        <template #trigger>
          <n-button dashed>
            <transition appear mode="out-in" name="coin">
              <!-- 已选择 -->
              <div class="selected" v-if="coin">
                <img :src="coin.icon" class="icon" />
                <span class="name"> {{ coin.name }} </span>
                <n-icon :size="18"><HandClick /></n-icon>
              </div>

              <!-- 未选择 -->
              <div class="selecting" v-else>
                <img src="@/assets/images/placeholder.svg" class="placeholder" />
                <span class="name"> Select Coin </span>
                <n-icon :size="18"><HandClick /></n-icon>
              </div>
            </transition>
          </n-button>
        </template>

        <template #header>
          <n-input
            autofocus
            clearable
            size="large"
            :minlength="1"
            placeholder="Search"
            :loading="searchLoading"
            @update:value="userSearchValue"
          >
            <template #prefix>
              <n-icon :size="25">
                <ListSearch />
              </n-icon>
            </template>
          </n-input>
        </template>

        <template #default>
          <n-scrollbar trigger="none" style="max-height: 500px">
            <n-spin :show="loadCoinsLoading" size="large" description="Loading coins">
              <div id="list">
                <!-- 代币列表 -->
                <XyzTransitionGroup appear-visible xyz="fade small-3 down-25% stagger-1.5">
                  <div class="item" v-for="it of coins" :key="it" @click="userConfirmCoin(it)">
                    <img :src="it.icon" class="icon" />
                    <span class="name"> {{ it.name }} </span>
                    <span class="blockchain"> {{ it.blockchain }} </span>
                  </div>
                </XyzTransitionGroup>

                <!-- 无数据 -->
                <div class="noData" v-if="!loadCoinsLoading && !coins.length">
                  <n-empty description="No coin yet" />
                </div>
              </div>
            </n-spin>
          </n-scrollbar>
        </template>
      </n-popover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#SelectCoin {
  flex: 1;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .selected {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 100%;
        overflow: hidden;
      }

      .name {
        font-size: 21px;
        font-weight: 400;
        color: #ffffff;
        line-height: 21px;
        margin: 0px 5px 0px 10px;
        font-family: "Ubuntu-Regular";
      }
    }

    .selecting {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        width: 32px;
        height: 32px;
        object-fit: contain;
        border-radius: 100%;
        overflow: hidden;
      }

      .name {
        font-size: 21px;
        font-weight: 400;
        color: #ffffff;
        line-height: 21px;
        margin: 0px 5px 0px 10px;
        font-family: "Ubuntu-Regular";
      }
    }
  }
}

#list {
  flex: 1;
  display: flex;
  flex-direction: column;

  min-height: 200px;

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;
    transition: all 0.5s;
    border-bottom: 1px solid #ffffff1a;
    padding: 10px;

    &:hover {
      border-radius: 10px;
      background: #ffffff1a;
      border-bottom: 1px solid transparent;
      transform: scale(0.97);
    }

    &:active {
      transform: scale(0.92);
    }

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 27px;
      height: 27px;
      object-fit: contain;
      border-radius: 100%;
      overflow: hidden;
    }

    .name {
      flex: 1;
      font-size: 15px;
      font-weight: 400;
      color: #ffffff;
      line-height: 15px;
      font-family: "Ubuntu-Regular";
      margin-left: 10px;
      opacity: 0.85;
    }

    .blockchain {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
      line-height: 12px;
      font-family: "Ubuntu-Medium";
      opacity: 0.43;
    }
  }

  .noData {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
