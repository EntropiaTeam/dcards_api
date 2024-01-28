import { Brand } from 'src/_common/enums/brand.enum';

type PdfData = {
  id: string;

  text: string;

  fontFamily: string;

  fontSize: string;

  fontColor: string;

  cardId: string;

  layout: string;

  orderNumber: string;

  create_date: Date;

  attributes: string[];

  textareaTop: number;

  textareaHeight: number;

  uiVersion: string;

  brand: Brand;
};

export { PdfData };
