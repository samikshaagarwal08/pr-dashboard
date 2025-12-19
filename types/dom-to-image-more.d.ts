declare module "dom-to-image-more" {
  interface Options {
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    filter?: (node: HTMLElement) => boolean;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
  }

  function toPng(node: HTMLElement, options?: Options): Promise<string>;
  function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8Array>;
  function toCanvas(node: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;

  const domToImage: {
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toSvg: typeof toSvg;
    toPixelData: typeof toPixelData;
    toCanvas: typeof toCanvas;
  };

  export { Options, toPng, toJpeg, toSvg, toPixelData, toCanvas };
  export default domToImage;
}

