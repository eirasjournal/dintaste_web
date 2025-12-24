"use server";

import { Resend } from 'resend';

// Asigură-te că ai cheia în fișierul .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  // Validare simplă (să aibă @)
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Invalid Syntax: Email required.' };
  }

  try {
    // --- AICI ESTE SCHIMBAREA: Trimitem email direct ție ---
    // Nu mai salvăm în Audiență, deci nu ne trebuie ID-ul.
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Adresa de test a Resend (merge garantat)
      to: 'eirasjournal@gmail.com',  // <--- SCHIMBĂ CU ADRESA TA REALĂ
      subject: 'New Subscriber Detected 🚀',
      text: `User with email: ${email} wants to subscribe to Din Taste.`,
    });

    return { success: true, message: 'Connection Established. Protocol Initiated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'System Error: Connection Failed.' };
  }
}