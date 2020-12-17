import { isMobile } from "@zsmartex/z-helpers";
import { notification } from "@/plugins/antd/custom";

export function EncryptEmail(email: string) {
  let email_name = email.split("@")[0];
  let email_domain = email.split("@")[1];
  email_name = [email_name.slice(0, 2), "**"].join("");
  email_domain = ["**", email_domain.split(".")[1]].join(".");

  return [email_name, email_domain].join("@");
}

export const runNotice = (type: ZTypes.NoticeType, message: string) => {
  if (!message) return;

  notification[type]({ message, placement: isMobile() ? "bottomCenter" : "topRight" });
};

export * from "./auth_mixin";
export * from "./market_channels";
export * from "./trade-action";
