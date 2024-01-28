export type SchedulerConfig = {
  cronGeneratePDF: string;
  cronDeleteObsoleteOrders: string;
  deleteObsoleteOrdersDays: number;
  deleteAbandonedOrdersDays: number;
};
