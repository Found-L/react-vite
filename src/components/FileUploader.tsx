import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const FileUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const { getRootProps, getInputProps } = useDropzone({
        accept: "*/*",
        multiple: false,
        onDrop: (acceptedFiles) => {
            setFile(acceptedFiles[0]);
        },
    });

    const uploadFile = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://192.168.88.198:3801/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data; charset=utf-8",
                    "Accept": "application/json",
                },
            });
            console.log('response',response.data.data);
            setResult(response.data.data.content);
        } catch (error) {
            setResult("Error parsing file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-5 border border-gray-300 mt-10">
            <h1 className="text-2xl font-bold mb-4">File Uploader</h1>
            <div
                {...getRootProps()}
                className="border-dashed border-2 p-10 text-center cursor-pointer bg-gray-100 text-black"
            >
                <input {...getInputProps()} />
                {file ? (
                    <p>Selected: {file.name}</p>
                ) : (
                    <p>Drag & drop a file here, or click to select one</p>
                )}
            </div>

            {file && (
                <button
                    onClick={uploadFile}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Upload & Parse"}
                </button>
            )}

            {result && (
                <div className="mt-4 p-4 border border-gray-300 bg-gray-50 text-black">
                    <h3 className="font-bold">Parsed Content:</h3>
                    <pre className="whitespace-pre-wrap">{result}</pre>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
