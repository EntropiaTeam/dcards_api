import { PrintEvent } from './print-event.type';

type PrintAttemptDelta = {
  print_attempts_count: number;
  last_print_attempt_date: Date;
  ea_order_number: string | undefined;
  print_attempts: PrintEvent[];
};

type PrintSuccessDelta = {
  print_successes_count: number;
  last_print_success_date: Date;
  ea_order_number: string | undefined;
  print_successes: PrintEvent[];
};

export {
  PrintAttemptDelta, PrintSuccessDelta
};
