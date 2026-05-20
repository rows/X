declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export interface TextContent {
    items: unknown[];
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }

  export function getDocument(options: {
    data: Uint8Array;
    disableWorker?: boolean;
    isEvalSupported?: boolean;
    useSystemFonts?: boolean;
  }): PDFDocumentLoadingTask;
}
