import ZSmartModel from "@zsmartex/z-eventbus";
import ApiClient from "@zsmartex/z-apiclient";
import { applyMixins } from "../mixins";
import MineControl from "./mine_control";
import OrdersController from "./orders";
import OrderBook from "./orderbook";
import Store, { IStore } from "./store";
import GettersSetters from "./getters_setters";
import config from '@/config';
import { PublicController } from '..';
import TradingView from "./tradingview";
import * as helpers from "@zsmartex/z-helpers";
import router from '@/router';

export class TradeController {
  constructor() {
    this.create_mine_control();
    this.orderbook = new OrderBook();
    this.store = Store;
    this.tradingview = new TradingView();

    ZSmartModel.on("page-ready", () => {
      this.market = PublicController.markets.find(market => market.id == localStorage.getItem("market") || config.default_market)
    });
  }

  open_exchange(market_id = this.market.id, side?: ZTypes.OrderSide) {
    const market = PublicController.markets.find(market => market.id == market_id);

    if (this.market.id != market.id) {
      this.market = market;
      localStorage.setItem("SYMBOLS_HASH", this.market.id);
    }

    if (router.currentRoute.fullPath.includes("/exchange")) return;

    const exchange_path = helpers.isMobile() ? "/m/exchange" : "/exchange";
    router.push({ path: exchange_path, query: { type: side } });
  }

  get_best_price(side: ZTypes.OrderSide | ZTypes.TakerType) {
    if (side === "buy") side = "bids";
    if (side === "sell") side = "asks";

    const depth = this.orderbook.toArray(side, 1);

    if (depth.length) return depth[0].price;
    return null;
  }

  get_depth(market_id: string, limit = 100) {
    return new ApiClient("finex").get("public/markets/" + market_id + "/depth", { limit: limit });
  }

  async get_trades(market_id: string, limit = 100) {
    try {
      const { data } = await new ApiClient("trade").get("public/markets/" + market_id + "/trades", { limit: limit });

      this.trades = data;
    } catch (error) {
      return error;
    }
  }

  add_trade(trade: ZTypes.PublicTrade) {
    this.trades.unshift({
      id: trade.id,
      price: trade.price,
      amount: trade.amount,
      total: trade.total,
      market: trade.market,
      created_at: trade.created_at,
      taker_type: trade.taker_type
    });

    this.trades.splice(100, 1);
  }
}

export interface TradeController extends OrdersController, MineControl, GettersSetters {
  orderbook: OrderBook;
  store: IStore;
  tradingview: TradingView;
}
applyMixins(TradeController, [OrdersController, MineControl, GettersSetters]);
const class_mounted = new TradeController();

export default class_mounted;
