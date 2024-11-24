import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma"; // Ensure this points to your Prisma client setup
import { IncomingMessage } from "http";

export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper to convert the Request object into an IncomingMessage
const convertRequestToIncomingMessage = async (request: Request): Promise<IncomingMessage> => {
    const { Readable } = await import("stream");

    const buffer = Buffer.from(await request.arrayBuffer());
    const readable = Readable.from([buffer]);

    Object.assign(readable, {
        headers: Object.fromEntries(request.headers),
        method: request.method,
        url: request.url,
    });

    return readable as unknown as IncomingMessage;
};

export async function POST(req: Request) {
    try {
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const nodeReq = await convertRequestToIncomingMessage(req);

        // Configure Formidable
        const form = formidable({
            multiples: false,
            uploadDir,
            keepExtensions: true,
            filename: (name, ext, part) => {
                return `${Date.now()}-${part.originalFilename}`;
            },
        });

        const [fields, files] = await new Promise<any>((resolve, reject) => {
            form.parse(nodeReq, (err, fields, files) => {
                if (err) return reject(err);
                resolve([fields, files]);
            });
        });

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file || !file.filepath) {
            console.error("Invalid file or missing file path:", file);
            return NextResponse.json({ error: "Invalid file or missing file path" }, { status: 400 });
        }

        const uploadedFilePath = `/uploads/${path.basename(file.filepath)}`;

        // Save the file details to the Media model in Prisma
        const media = await prisma.media.create({
            data: {
                url: uploadedFilePath, // Save the file URL
                type: file.mimetype, // Save the MIME type
            },
        });

        // Respond with the media record
        return NextResponse.json({
            message: "File uploaded successfully",
            media,
        });
    } catch (error) {
        console.error("File upload error:", error);
        return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }
}
