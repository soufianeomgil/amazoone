// lib/init.ts

import { startHardDeleteCron } from "@/actions/product.actions";


let initialized = false;

export function initServer() {
  if (!initialized) {
    startHardDeleteCron();
    initialized = true;
  }
}
