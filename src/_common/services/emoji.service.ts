/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { AppConfigService } from './app-config.service';
import { AzureService } from './azure.service';

const GraphemeSplitter = require('grapheme-splitter');
@Injectable()
export class EmojiService {
  constructor(
    private appConfigService: AppConfigService,
    private azureService: AzureService
  ) {
  }

  REGEX_EMOJI = /\u00a9|\u00ae|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;

  private isCharEmoji(char: string): boolean {
    return !char.replace(this.REGEX_EMOJI, '').length || char.length > 1;
  }

  private getEmojiUnicode(input: string): string {
    if (input.length === 1) {
      return input.charCodeAt(0).toString();
    } if (input.length > 1) {
      const pairs = [];
      for (let i = 0; i < input.length; i += 1) {
        if (
        // high surrogate
          input.charCodeAt(i) >= 0xd800
            && input.charCodeAt(i) <= 0xdbff
        ) {
          if (
            input.charCodeAt(i + 1) >= 0xdc00
              && input.charCodeAt(i + 1) <= 0xdfff
          ) {
            // low surrogate
            pairs.push(
              (input.charCodeAt(i) - 0xd800) * 0x400
                  + (input.charCodeAt(i + 1) - 0xdc00)
                  + 0x10000
            );
          }
        } else if (
          input.charCodeAt(i) < 0xd800
            || input.charCodeAt(i) > 0xdfff
        ) {
          // modifiers and joiners
          if (input.charCodeAt(i) !== 65039) {
            pairs.push(input.charCodeAt(i));
          }
        }
      }
      return pairs.join(' ');
    }

    return '';
  }

  private checkEmojiType(char: string): {isFlag: boolean; isComplex: boolean} {
    let detectedType = { isFlag: false, isComplex: false };
    const allSigns = '[\\u{1F1E6}-\\u{1F1FF}]';
    const allLetters = '[\\u{E0061}-\\u{E007A}]';
    const countryEmojiRanges = `${allSigns + allSigns}`;
    const complexCountryEmojiRanges = `\\u{1F3F4}${allLetters}`;
    const countryEmojiRx = new RegExp(countryEmojiRanges, 'ug');
    const complexCountryEmojiRx = new RegExp(complexCountryEmojiRanges, 'ug');
    const charMatchFlag = char.match(countryEmojiRx);
    const charMatchComplexFlag = char.match(complexCountryEmojiRx);
    if (charMatchFlag !== null) {
      detectedType = { isFlag: true, isComplex: false };
    } else if (charMatchComplexFlag !== null) {
      detectedType = { isFlag: true, isComplex: true };
    }
    return detectedType;
  }

  private getFlagFilename(char: string): string {
    const flagNameArray: string[] = [];
    this.getEmojiUnicode(char).split(' ').forEach((letter) => {
      flagNameArray.push(String.fromCharCode(parseInt(letter, 10) - 127397));
    });
    const flagName = flagNameArray.join('');
    return flagName;
  }

  private getComplexFlagFilename(char: string): string {
    const flagNameArray: string[] = [];
    const charArray = this.getEmojiUnicode(char).split(' ');
    charArray.forEach((letter, index) => {
      if (index > 0) {
        if (index === charArray.length - 1 && charArray.length > 2) {
          flagNameArray.splice(2, 0, '-');
        } else {
          const getLetter = String.fromCharCode(parseInt(letter, 10) - 32);
          flagNameArray.push(getLetter);
        }
      }
    });
    const flagName = flagNameArray.join('');
    return flagName;
  }

  // return pure unicode with "_" for surrogate pairs
  private getPngFileUnicode(input: string, divider = '_'): string {
    const emojiCode = this.getEmojiUnicode(input)
      .split(' ')
      .map((val) => parseInt(val, 10).toString(16))
      .join(divider);
    return emojiCode;
  }

  newLineDevider(incomingText: string): string[] {
    const preparedLines:string[] = incomingText.split(/\r\n|\r|\n/);
    return preparedLines;
  }

  emoji(
    doc: PDFKit.PDFDocument,
    text: string,
    posX: number,
    orderId: string,
    verticalTextareaCenter: number,
    maximumHeight: number,
    comingFontSize: string,
    fontFile: Buffer,
    changedFontsize: boolean
  ): void {
    const fontSize = Number(comingFontSize) * 1.3;
    let positionX = posX;
    let positionY = verticalTextareaCenter;
    const lineHeight = fontSize * 1.36;

    doc.fontSize(fontSize);
    doc.font(fontFile);
    const pdfWidth = this.appConfigService.pdfConfig.portrait.insidePrimary.options.fit
      ? this.appConfigService.pdfConfig.portrait.insidePrimary.options.fit[0]
      : 2100;

    const reduceFontSize = () => {
      this.emoji(
        doc,
        text,
        posX,
        orderId,
        verticalTextareaCenter,
        maximumHeight,
        `${Number(comingFontSize) * 0.95}`,
        fontFile,
        true
      );
    };

    const lines = this.newLineDevider(text);
    positionY -= (lines.length * lineHeight) / 2;
    if ((lines.length * lineHeight) > maximumHeight) {
      reduceFontSize();
      return;
    }
    const splitter = new GraphemeSplitter();

    const BreakException = {} as Error;
    let modifiedLines;
    try {
      modifiedLines = lines.map((line: string) => {
        const adoptedLineArray: string[] = splitter.splitGraphemes(line);
        const modifiedLine = this.emojiMatcher(adoptedLineArray);
        const lineWidth = this.getLineWidth(doc, fontSize, modifiedLine);
        const cardPageWidth = pdfWidth / 2;
        positionX = cardPageWidth + (cardPageWidth / 2 + 6) - lineWidth / 2;
        if (positionX < (cardPageWidth + 25)) {
          throw BreakException;
        }
        return modifiedLine;
      });
    } catch (e) {
      reduceFontSize();
      return;
    }

    modifiedLines.forEach((modifiedLine: string[]) => {
      const lineWidth = this.getLineWidth(doc, fontSize, modifiedLine);
      const cardPageWidth = pdfWidth / 2;
      positionX = cardPageWidth + (cardPageWidth / 2 + 6) - lineWidth / 2;
      modifiedLine.forEach((char: string) => {
        if (this.isCharEmoji(char)) {
          const isFlagData = this.checkEmojiType(char);
          if (isFlagData.isFlag) {
            if (!isFlagData.isComplex) {
              const flagName = this.getFlagFilename(char);
              const emojiPath = `./assets/png/flags/${flagName}.png`;
              positionX = this.addPNGToDoc(emojiPath, fontSize, positionX, positionY, doc);
            } else if (isFlagData.isComplex) {
              const flagName = this.getComplexFlagFilename(char);
              const emojiPath = `./assets/png/flags/${flagName}.png`;
              positionX = this.addPNGToDoc(emojiPath, fontSize, positionX, positionY, doc);
            }
          } else {
            const emojiPath = `./assets/png/emoji_u${this.getPngFileUnicode(char)}.png`;
            positionX = this.addPNGToDoc(emojiPath, fontSize, positionX, positionY, doc);
          }
        } else {
          positionX = this.addTextToDoc(char, doc, fontSize, positionX, positionY);
        }
      });
      positionX = posX;
      positionY += lineHeight;
      return true;
    });
    if (changedFontsize) {
      this.azureService.trackEvent({
        name: 'emoji.service: Font Size Increased',
        properties: {
          orderId,
          finalFontsize: comingFontSize,
          numberOfLines: lines.length
        }
      });
    }
  }

  private getLineWidth(doc: PDFKit.PDFDocument, fontSize: number, lineArray: string[]) {
    let lineWidth = 0;
    lineArray.forEach((char: string) => {
      if (this.isCharEmoji(char)) {
        lineWidth += fontSize;
      } else {
        lineWidth += doc.widthOfString(char);
      }
    });
    return lineWidth;
  }

  private emojiMatcher(symbolsInLine: string[]): string[] {
    const modifiedLine = symbolsInLine;
    symbolsInLine.forEach((symbol, index) => {
      const nextSymbol = symbolsInLine[index + 1];
      if (!nextSymbol) {
        return;
      }
      if (this.isCharEmoji(symbol)) {
        if (this.isCharEmoji(nextSymbol)) {
          const possiblePath = `./assets/png/emoji_u${this.getPngFileUnicode(symbol)}_${this.getPngFileUnicode(nextSymbol)}.png`;

          if (fs.existsSync(possiblePath)) {
            modifiedLine.splice(index, 2, symbol + nextSymbol);
          }
        }
      }
    });
    return modifiedLine;
  }

  private addPNGToDoc(
    path: string,
    fontSize: number,
    positionX: number,
    positionY: number,
    doc: PDFKit.PDFDocument
  ): number {
    const pngWidth = Number(fontSize);
    try {
      if (fs.existsSync(path)) {
        doc.image(
          path,
          positionX,
          positionY,
          {
            width: pngWidth
          }
        );
        return positionX + pngWidth;
      }
      // add message that emoji with path not found in assets
      return positionX;
    } catch (error) {
      const incomingError = <Error>error;
      throw new InternalServerErrorException({
        message: `${incomingError.message} unresolved path: ${path}`
      });
    }
  }

  private addTextToDoc(
    text: string,
    doc: PDFKit.PDFDocument,
    fontSize: number,
    positionX: number,
    positionY: number
  ): number {
    doc.fontSize(fontSize);
    const blockW = doc.widthOfString(text);
    doc.text(text, positionX, positionY);

    return positionX + blockW;
  }
}
