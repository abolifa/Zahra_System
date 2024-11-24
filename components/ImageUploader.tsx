import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { ImageUpIcon, LoaderPinwheel, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface ImageUploaderProps {
    onUploadSuccess: (id: string | null) => void;
    existingImage?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess, existingImage }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        const fetchImage = async () => {
            if (!existingImage) return;

            try {
                const response = await fetch(`/api/media/${existingImage}`);
                if (response.ok) {
                    const { media } = await response.json(); // Extract the `media` object
                    console.log("Fetched media data:", media);

                    if (media && media.url) {
                        setPreviewUrl(media.url); // Set the `url` to `previewUrl`
                        console.log("Preview URL:", media.url);
                    } else {
                        console.error("Media URL is missing in the response.");
                    }
                } else {
                    toast.error("Failed to load existing image.");
                }
            } catch (error) {
                console.error("Error fetching existing image:", error);
                toast.error("Failed to fetch existing image.");
            }
        };

        fetchImage();
    }, [existingImage]);


    console.log("Preview URL:", previewUrl);


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

    const handleDelete = () => {
        setPreviewUrl(null);
        onUploadSuccess(null);
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
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="absolute top-2 right-2"
                            variant={'destructive'}
                        >
                            <Trash2 />
                        </Button>
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
