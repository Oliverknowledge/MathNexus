import { signIn } from '@/auth';
import { Sign } from 'crypto';
import {NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { email, password } =  await req.json();
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        
        return NextResponse.json({message: "Logged in successfully"}, {status: 200});



    }
    else{
        return NextResponse.json({message: "Invalid credentials"}, {status: 401});
    }
}
