import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Things() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    try {
      const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.post("http://localhost:5000/api/files/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Study material uploaded successfully! Analysis started.");
        setSelectedFile(null);
        // Redirect to dashboard home to see analysis status (if we implemented it)
        // For now, let's just stay here or redirect to list
        navigate("/dashboard/my-files");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload study material.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Upload Study Materials
        </h2>
        <p className="text-gray-600 mb-6">
          Drag and drop your files here, or click to browse. We support PDF,
          DOCX, and TXT files.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
          />
          <div className="flex flex-col items-center">
            <svg
              className={`w-16 h-16 mb-4 transition-colors ${selectedFile ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-lg font-medium text-gray-700 mb-2">
              {selectedFile ? selectedFile.name : "Choose files to upload"}
            </span>
            <span className="text-sm text-gray-500">
              {selectedFile ? "File selected" : "or drag and drop them here"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl
              ${uploading || !selectedFile
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : "Start Analysis"}
          </button>
        </div>

        <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            PDF
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            DOCX
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            TXT
          </div>
        </div>
      </div>
    </div>
  );
}
