import { Column } from 'typeorm';

export class PrintEvent {
  @Column() store_number!: string;

  @Column() employee_id!: string;

  @Column() time!: Date;

  @Column() client_ip?: string | null;
}
