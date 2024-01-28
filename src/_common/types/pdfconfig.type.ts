type PageProperties = {
  x?: number;
  y?: number;
  options: PDFKit.Mixins.ImageOption;
  rotation: {
    angle: number;
    options: {
      origin?: number[];
    };
  };
  text?: {
    x: number;
    y: number;
  };
};

type Layout = {
  outsideFront: PageProperties;
  outsideBack: PageProperties;
  insidePrimary: PageProperties;
  insideSecondary?: PageProperties;
};

type PdfConfig = {
  customImage: {
    maxSize: number;
  };
  landscape: Layout;
  portrait: Layout;
};

export { PdfConfig };
