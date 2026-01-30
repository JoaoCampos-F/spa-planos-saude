import { notifySnake } from "@/stores/notifySnake";

type typeMessage = "error" | "success" | "warning" | "info";

export function notify(
  message: string,
  type: typeMessage,
  timeout: number = 3000
) {
  notifySnake.show = true;
  notifySnake.message = message;
  notifySnake.type = type;

  setTimeout(() => {
    notifySnake.show = false;
  }, timeout);
}
