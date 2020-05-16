export default [
  {
    path: "/m",
    name: "Mobile",
    component: () => import("@/views/mobile/_index.vue"),
    children: [
      {
        path: "/",
        component: () => import("@/views/mobile/_home.vue")
      },
      {
        path: "exchange",
        component: () => import("@/views/mobile/_exchange.vue")
      },
      {
        path: "markets",
        component: () => import("@/views/mobile/_markets.vue")
      },
      {
        path: "assets",
        component: () => import("@/views/mobile/_assets.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "personal",
        component: () => import("@/views/mobile/_personal.vue")
      }
    ],
    meta: {
      mobile: true
    }
  }
];
