import config from "@/config";
import ApiClient from "@zsmartex/z-apiclient";
import * as helpers from "@zsmartex/z-helpers";

export default abstract class OrdersController {
  async create_order(market_id: string, side: ZTypes.OrderSide, ord_type: ZTypes.OrdType = "limit", price: number, amount: number): Promise<ZTypes.Order> {
    try {
      const response = await new ApiClient("finex").post("market/orders", {
        market: market_id,
        side: side,
        price: price,
        volume: amount
      });
      helpers.runNotice("success", "Order has been placed");

      return response.data;
    } catch (error) {
      return error;
    }
  }

  async stop_order(id_or_uuid: number | string) {
    try {
      await new ApiClient("finex").post("market/orders/cancel/#{id}".replace("#{id}", id_or_uuid.toString()));
      helpers.runNotice("success", helpers.translation("message.order.canceled").toString());
    } catch (error) {
      return error;
    }
  }

  async stop_orders(market_id?: string, side?: ZTypes.OrderSide) {
    try {
      await new ApiClient("finex").post("market/orders/cancel", { market: market_id, side: side });
      helpers.runNotice("success", "All market #{market} orders have been canceled".replace("#{market}", market_id));
    } catch (error) {
      return error;
    }
  }
}
