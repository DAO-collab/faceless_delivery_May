<script setup lang="ts">
const emits = defineEmits(["userClickRouteBack"]);

const props = defineProps<{
  name: string;
}>();

const toBack = () => {
  emits("userClickRouteBack", props.name);
};
</script>

<template>
  <div id="RouteBack" @click="toBack">
    <img src="@/assets/images/back.svg" alt="back" />
    <span class="name"> BACK </span>
  </div>
</template>

<style lang="scss" scoped>
#RouteBack {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;

  &:hover .name {
    color: #ffffff;
    text-decoration: underline;
  }

  &:hover img {
    transform: translateX(-5px);
  }

  img {
    width: 24px;
    transition: all 0.5s;
    object-fit: contain;
  }

  .name {
    font-size: 14px;
    color: #8c939a;
    line-height: 14px;
    font-family: "Ubuntu-Medium";
    transition: all 0.5s;
    margin-left: 5px;
  }
}
</style>
