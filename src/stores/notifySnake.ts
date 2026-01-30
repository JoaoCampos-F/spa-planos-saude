import { reactive } from "vue";

type Notify = {
  show?: boolean;
  message: string;
  type: "info" | "error" | "success" | "warning";
};

export const notifySnake: Notify = reactive({
  show: false,
  message: "snak nofiy",
  type: "info",
});

export type { Notify };
