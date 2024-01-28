import { Transform } from 'stream';

export default class Rounder extends Transform {
  _transform(chunk: number, encoding: string, callback: () => void): void {
    this.push(Math.round(chunk));
    callback();
  }
}
