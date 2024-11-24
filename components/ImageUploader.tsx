import React, { useState } from "react";
import { Label } from "./ui/label";
import { ImageUpIcon, LoaderPinwheel } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
    onUploadSuccess: (id: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Image uploaded successfully.");
                onUploadSuccess(data.media.id);
            } else {
                toast.error("Failed to upload image.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-start justify-start gap-4">
            <Label>Upload Image</Label>
            <div
                className="aspect-square max-w-xl w-full h-40 bg-secondary rounded-lg 
                flex flex-col items-center justify-center gap-3 p-1 relative"
            >
                {previewUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img src={previewUrl} className="overflow-hidden object-cover w-full h-full blur-sm opacity-85" />
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="absolute object-contain w-full h-3/4 rounded-lg"
                        />
                    </div>
                ) : (
                    <>
                        <ImageUpIcon className="text-muted-foreground" size={28} />
                        <p className="text-xs text-muted-foreground">
                            Click to upload image
                        </p>
                    </>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
                {isUploading && (
                    <div className="absolute top-2 right-2 text-sm text-primary flex items-center justify-start gap-1.5">
                        <LoaderPinwheel className="animate-spin" size={16} />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
