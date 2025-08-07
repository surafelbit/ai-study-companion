import React from "react";

export default function Things() {
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

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".pdf,.docx,.txt"
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
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
                Choose files to upload
              </span>
              <span className="text-sm text-gray-500">
                or drag and drop them here
              </span>
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Analysis
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
