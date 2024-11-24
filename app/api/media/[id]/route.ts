import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


// fetch media using id
export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params; // `id` is the mediaId

    try {
        const media = await prisma.media.findUnique({ where: { id } });

        if (!media) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 });
        }

        return NextResponse.json({ media }, { status: 200 });
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const { id } = context.params; // `id` is the mediaId

    try {
        // Fetch the media record
        const media = await prisma.media.findUnique({ where: { id } });

        if (!media) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 });
        }

        // Determine the file path
        const filePath = path.join(process.cwd(), "public", media.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete the file
        }

        // Remove the media record from the database
        await prisma.media.delete({ where: { id } });

        return NextResponse.json({ message: "Media deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting media:", error);
        return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }
}
