type PrintEvent = {
  store_number: string;

  employee_id: string;

  time: Date;

  client_ip?: string | null;

  api_version?: string;
};

export { PrintEvent };
