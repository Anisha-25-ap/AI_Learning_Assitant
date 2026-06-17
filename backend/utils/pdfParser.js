import fs from "fs/promises";

import { PDFParse } from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {string } filePath -path to PDF file
 * @returns {promise<{text: string, numpages: number}>}
 */

export const extractTextFromPDF = async (filePath) => {
  try{
    const dataBuffer = await fs.readFile(filePath);
    // pdf-parse expects a UinBArray, not a Buffer 
    const parser = new  PDFParse(new  Uint8Array(dataBuffer));
    const data = await parse.getText();
    
    return{
      text: data.text,
      numpages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parseing error: ",error);
    throw new Error("Failed to extract text from PDF");
  }
};


