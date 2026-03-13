import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UploadedFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchFiles = async () => {
        try {
            const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/files", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response, "this is response")

            if (response.data.status === "success") {
                setFiles(response.data.data.files);
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            toast.error("Failed to fetch uploaded files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user]);

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
                toast.success("File uploaded successfully!");
                setSelectedFile(null);
                fetchFiles(); // Refresh the list
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Uploaded Files</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage your study materials</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="flex-1 md:flex-none">
                        <span className="sr-only">Choose study material</span>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                            accept=".pdf,.docx,.txt"
                        />
                    </label>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                            ${uploading || !selectedFile
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                    >
                        {uploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </div>
                        ) : "Upload"}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-sm font-medium text-gray-700">Recent Uploads</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {files.length} Files
                </span>
            </div>

            {files.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h4>
                    <p className="text-gray-600">
                        Upload your study materials to see them here and get AI insights.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 font-semibold text-gray-600 text-sm">File Name</th>
                                <th className="pb-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Uploaded At</th>
                                <th className="pb-4 font-semibold text-gray-600 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {files.map((file) => (
                                <tr key={file._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                {file.fileName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-500 hidden md:table-cell">
                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => navigate(`/dashboard/qa/${file._id}`)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                Ask AI
                                            </button>
                                            <a
                                                href={file.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
