import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
// REMOVED: import { mergeAlias } from "vite"; <- Yeh line hi sabse bade crash ki wajah thi!

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
    // Consistent fallback standard response.data.data or response.data
    return response.data?.data ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch documents' };
  }
};

const uploadDocument = async (formData) => { // Lowercase argument kiya
  try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
      headers: {
        // Fixed typo: changed 'from-data' to 'form-data'
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload document' };
  }
};

const deleteDocument = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete document' };
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS_BY_ID(id));
    return response.data?.data ? response.data.data : response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch document details' };
  }
};

const documentService = { 
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
};

export default documentService;