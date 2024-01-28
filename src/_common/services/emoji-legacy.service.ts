/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { AppConfigService } from './app-config.service';
import { AzureService } from './azure.service';

const GraphemeSplitter = require('grapheme-splitter');

@Injectable()
export class LegacyEmojiService {
  constructor(
    private appConfigService: AppConfigService,
    private azureService: AzureService
  ) {
  }

  REGEX_EMOJI = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;

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

  private testNewLine(x: string): boolean {
    const white = new RegExp(/\r\n|\r|\n/);
    return white.test(x);
  }

  private testWhiteSpace(x: string): boolean {
    const white = new RegExp(/^\s$/);
    return white.test(x);
  }

  private wordWrap(incomingLineArray: string[], maxChars: number): string {
    const newLineStr = '\n';
    let wrappedLines = '';
    let arrayStillToWrap = incomingLineArray;
    let securityIterationVariable = 0;

    while (arrayStillToWrap.length > 0) {
      let emojiCountInLine = 0;
      const whiteSpaceIndexes = [];
      let found = false;
      // Inserts new line at first whitespace of the line
      const iterationArray = arrayStillToWrap.slice(0, maxChars);
      for (let i = iterationArray.length - 1; i > 0; i -= 1) {
        if (this.isCharEmoji(iterationArray[i])) {
          emojiCountInLine += 1;
        }
        if (this.testWhiteSpace(iterationArray[i])) {
          whiteSpaceIndexes.push(i);
          found = true;
        }
      }
      let realLineEnd = 0;
      if (emojiCountInLine > 0) {
        realLineEnd = maxChars - Math.ceil(emojiCountInLine / 2)
        - (maxChars - iterationArray.length) / 2;
      } else {
        realLineEnd = maxChars;
      }

      const adoptedIterationArray = (iterationArray.length > realLineEnd)
        ? iterationArray.slice(0, realLineEnd) : iterationArray;
      if (found === true
        && adoptedIterationArray.length > whiteSpaceIndexes[0]
        && adoptedIterationArray.length === realLineEnd) {
        for (let i = 0; i <= whiteSpaceIndexes.length; i += 1) {
          const lastWhiteSpace = adoptedIterationArray[whiteSpaceIndexes[i]];
          if (lastWhiteSpace) {
            const wrappedLine = adoptedIterationArray.slice(0, whiteSpaceIndexes[i]);
            wrappedLines += wrappedLine.join('') + newLineStr;
            arrayStillToWrap = arrayStillToWrap.slice(wrappedLine.length);
            break;
          }
        }
      } else {
        const wrappedLine = adoptedIterationArray;
        wrappedLines += wrappedLine.join('');
        if (wrappedLine.length < arrayStillToWrap.length) {
          wrappedLines += newLineStr;
        }
        arrayStillToWrap = arrayStillToWrap.slice(wrappedLine.length);
      }
      securityIterationVariable += 1;
      if (securityIterationVariable > incomingLineArray.length) {
        break;
      }
    }

    return wrappedLines;
  }

  newLineDevider(incomingArray: string[], maxLineChars:number): string[] {
    let preparedLines:string[] = [];
    const newLineIndexes: number[] = [];
    let stillToWrapFirstSymbolIndex = 0;
    incomingArray.forEach((symbol: string, index: number) => {
      if (this.testNewLine(symbol)) {
        newLineIndexes.push(index);
      }
    });
    newLineIndexes.push(incomingArray.length);
    newLineIndexes.forEach((enterIndex) => {
      const arrayToWordWrap = incomingArray.slice(stillToWrapFirstSymbolIndex, enterIndex);
      stillToWrapFirstSymbolIndex = enterIndex + 1;
      const newLines = this.wordWrap(arrayToWordWrap, Math.round(maxLineChars));
      preparedLines = preparedLines.concat(newLines.split(/\r?\n/));
    });
    return preparedLines;
  }

  private prepareWrappedText(text: string, maxLineChars: number): string[] {
    const splitter = new GraphemeSplitter();
    const adoptedLineArray: string[] = splitter.splitGraphemes(text);
    const modifiedLinesArray = this.emojiMatcher(adoptedLineArray);
    const preparedLines: string[] = this.newLineDevider(modifiedLinesArray, maxLineChars);
    return preparedLines;
  }

  // X - width, Y - height
  emoji(
    doc: PDFKit.PDFDocument,
    text: string,
    posX: number,
    orderId: string,
    verticalCenter: number,
    maximumHeight: number,
    comingFontSize: string,
    fontFile: Buffer,
    changedFontsize: boolean
  ): void {
    const fontSize = Number(comingFontSize);
    let positionX = posX;
    let positionY = verticalCenter;
    const lineHeight = fontSize * 1.36;

    doc.fontSize(fontSize);
    doc.font(fontFile);
    const pdfWidth = this.appConfigService.pdfConfig.portrait.insidePrimary.options.fit
      ? this.appConfigService.pdfConfig.portrait.insidePrimary.options.fit[0]
      : 2100;
    const lineMaxWidth = pdfWidth / 2 - 50 * 2;
    const widthOfString = doc.widthOfString('2');
    const maxLineChars = lineMaxWidth / widthOfString;
    const splitter = new GraphemeSplitter();
    const lines = this.prepareWrappedText(text, maxLineChars);
    positionY -= (lines.length * fontSize * 1.2) / 2;
    if ((lines.length * lineHeight) > maximumHeight) {
      this.emoji(
        doc,
        text,
        posX,
        orderId,
        verticalCenter,
        maximumHeight,
        `${Number(comingFontSize) * 0.95}`,
        fontFile,
        true
      );
      return;
    }
    lines.forEach((line: string) => {
      const adoptedLineArray: string[] = splitter.splitGraphemes(line);
      const modifiedLineArray = this.emojiMatcher(adoptedLineArray);
      const lineWidth = this.getLineWidth(doc, fontSize, modifiedLineArray);
      positionX = pdfWidth / 2 + (pdfWidth / 2 / 2 + 6) - lineWidth / 2;
      modifiedLineArray.forEach((char: string) => {
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
      const lineW = doc.widthOfString(line);
      const lineH = doc.heightOfString(line, { width: lineW });
      positionY += lineH;

      if (line === '') {
        doc.text(line, positionX, positionY);
        const blockH = doc.heightOfString('W');
        positionY += blockH;
      }
    });
    if (changedFontsize) {
      this.azureService.trackEvent({
        name: 'emoji-legacy.service: Font Size Increased',
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
      if (this.isCharEmoji(symbol) && this.isCharEmoji(nextSymbol)) {
        let currentSymbol = symbol;
        let possiblePath;
        const isFlagData = this.checkEmojiType(symbol);
        if (isFlagData.isFlag) {
          currentSymbol = this.getPngFileUnicode(symbol);
          possiblePath = `./assets/png/emoji_u${currentSymbol}_${this.getPngFileUnicode(nextSymbol)}.png`;
        } else {
          possiblePath = `./assets/png/emoji_u${this.getPngFileUnicode(currentSymbol)}_${this.getPngFileUnicode(nextSymbol)}.png`;
        }

        if (fs.existsSync(possiblePath)) {
          modifiedLine.splice(index, 2, currentSymbol + nextSymbol);
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
    const pngVerticalCorrection = 0;
    const pngWidth = Number(fontSize);
    const pngHeight = Number(fontSize);
    try {
      if (fs.existsSync(path)) {
        doc.image(
          path,
          positionX,
          positionY + pngHeight * pngVerticalCorrection,
          {
            width: pngWidth,
            height: pngHeight
          }
        );
      } else {
        // add message that emoji with path not found in assets
        return positionX;
      }
    } catch (error) {
      const incomingError = <Error>error;
      throw new InternalServerErrorException({
        message: incomingError.message
      });
    }
    return positionX + pngWidth;
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
