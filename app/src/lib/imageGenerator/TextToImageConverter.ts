import TextToSvg from 'text-to-svg';

export class TextToImageConverter {
  private tts: TextToSvg;

  constructor() {
    this.tts = TextToSvg.loadSync();
  }

  public createPresetnTo(to: string, prefix: string = '祝公演'): string {
    return this.tts.getSVG(`${prefix} ${to} 様`, {fontSize: 36, anchor: 'left top'});
  }

  public createPresentFrom(from: string): string {
    return this.tts.getSVG(`${from} より`, {fontSize: 36, anchor: 'left top'});
  }

  public createEventName(eventName: string) {
    return this.tts.getSVG(eventName, {fontSize: 24, anchor: 'left top'});
  }
}
