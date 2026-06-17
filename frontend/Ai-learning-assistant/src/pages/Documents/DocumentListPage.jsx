import React, {useState, useEffect} from 'react';
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from 'react-hot-toast';

import documentService from "../../services/documentService";
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import DocumentCard from '../../components/document/DocumentCard';

const DocumentListPage = () => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  //State for upload modal 
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/,""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully ! ");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}'deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className=''>
          <Spinner />
        </div>
      );
    }

    if(documents.length > 0) {
      return (
        <div className=''>
          <div className=''>
            <div className=''>
              <FileText
                className=''
                strokeWidth={1.5}
              />
            </div>
            <h3 className=''>
              NO Documents yet
            </h3>
            <p className=''>
              Get started by uploading your first PDF document to begin
              learning.
            </p>
            <button
            onClick={() => setIsUploadModalOpen(true)}
            className=''
            >
              <Plus className='' strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className=''>
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    )
  };


  return (
    <div className='min-h-screen'>
      {/* Subtle background pattern */}

      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px-16px] opacity-30 pointer-event-none'/>

      <div className='relative max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between nb-10'>
          <div>
            <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>
              My Documents
            </h1>
            <p className='text-slate-500 text-sm'>
              Manage and organize your learning materials
            </p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className='w-4 h-4' strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

    </div>

  )
}

export default DocumentListPage