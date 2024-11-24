import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


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

// Delete a record
export async function DELETE(req: Request,
    { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        await prisma.brand.delete({
            where: { id },
            include: { media: true }
        });
        return NextResponse.json({ message: 'Record deleted' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}