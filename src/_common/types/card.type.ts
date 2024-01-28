type Font = {
  family: string;
  size: string;
  weight: string;
  color: string;
};

type Card = {
  id: string;
  name: string;
  type: string;
  attributes: string[];
  category: string[];
  tags: string[];
  culture: string[];
  font: Font;
  textarea_offset: {
    top: number;
    bottom: number;
  };
};

export { Card };
