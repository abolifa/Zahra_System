import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


// Fetch single record
export async function GET(req: Request,
    { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
            include: {
                media: true,
            }
        });
        return NextResponse.json(brand, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}

// Update a record
export async function PUT(req: Request,
    { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const { name, slug, mediaId } = await req.json();
        const brand = await prisma.brand.update({
            where: { id },
            data: { name, slug, mediaId }
        });
        return NextResponse.json(brand, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}



export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    // Fetch the brand with its associated media
    const brand = await prisma.brand.findUnique({
        where: { id },
        include: { media: true },
    });

    if (!brand) {
        return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Delete associated media file if it exists
    if (brand.media) {
        const filePath = path.join(process.cwd(), "public", brand.media.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Delete file from file system
        }
        await prisma.media.delete({ where: { id: brand.media.id } }); // Delete media from DB
    }

    // Delete the brand from the database
    await prisma.brand.delete({ where: { id } });

    return NextResponse.json(
        { message: "Brand and associated media deleted successfully" },
        { status: 200 }
    );
}
