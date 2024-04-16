export enum ErrorCodes {
    GOOGLE_CHROME_INTERNAL_PAGES
  }
  
  export const ERROR_MESSAGES = new Map<ErrorCodes, string>(
    [
      [ErrorCodes.GOOGLE_CHROME_INTERNAL_PAGES, "Open a page with a table, then try again!"]
    ]
  );
 
