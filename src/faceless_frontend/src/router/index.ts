import { useWallet } from "@/store";
import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import { createAccount } from "@/utils/registerAccount";

// OmniAuth
const callbackOmniAuth = async (to, from, next) => {
  const authHeaders = {
    headers: {
      "access-token": to.query.auth_token,
      client: to.query.client_id,
      uid: to.query.uid,
    },
    data: {
      data: {
        nickname: to.query.nickname,
      },
    },
  };

  if (to.params.provider === "google_oauth2") {
    await createAccount("Google", to.query.nickname);
  }

  if (to.params.provider === "twitter") {
    await createAccount("Twitter", to.query.nickname);
  }

  if (to.params.provider === "telegram") {
    await createAccount("Telegram", to.query.nickname);
  }

  if (to.params.provider === "cancel") {
    await createAccount("", "");
  }

  next("/wallet");
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/index.vue"),
    meta: { check: false },
  },

  {
    path: "/app",
    component: () => import("@/views/app.vue"),
    meta: { check: false },

    children: [
      {
        // 匹配根路径
        path: "/app",
        // 重定向到
        redirect: "wallet",
      },

      {
        path: "/wallet",
        component: () => import("@/views/wallet.vue"),
        meta: { check: false },
      },

      {
        path: "/transfer",
        component: () => import("@/views/transfer.vue"),
        meta: { check: false },
      },
    ],
  },

  {
    name: "error",
    path: "/:path(.*)*",
    component: () => import("@/views/error.vue"),
    meta: { check: false },
  },

  {
    path: "/omniauth/:provider/callback",
    name: "Callback",
    component: () => import("@/views/wallet.vue"),
    beforeEnter: callbackOmniAuth,
  },
];

const router = createRouter({
  // History模式
  history: createWebHistory(),

  scrollBehavior: () => ({
    behavior: "smooth",
    top: 0,
  }),

  routes,
});

router.beforeEach(({ meta: { check, home }, name, params }, from, next) => {
  if (check) {
    const { account } = useWallet().connect;
    if (account) return next();
    return next("/");
  }

  return next();
});

export default router;
