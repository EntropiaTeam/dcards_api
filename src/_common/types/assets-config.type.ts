import { AssetType } from '../enums/asset-type.enum';
import { Brand } from '../enums/brand.enum';

export type AssetsConfig = {
  [Brand.Dcards]: Record<string, string>;
  [AssetType.thumbnail]: string;
  [AssetType.mediumThumbnail]: string;
  [AssetType.gallery]: string;
  [AssetType.editor]: string;
  [AssetType.print]: string;
};
