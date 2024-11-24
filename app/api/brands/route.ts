import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Feth all records
export async function GET(req: Request) {
    try {
        const brands = await prisma.brand.findMany({
            include: {
                media: true,
            }
        });
        return NextResponse.json(brands, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}

// Create a new record
export async function POST(req: Request) {
    try {
        const { name, slug, mediaId } = await req.json();
        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                mediaId: mediaId || null,
            }
        });
        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}