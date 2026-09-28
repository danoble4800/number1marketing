import { redirect } from 'next/navigation';

// Tap Cards admin now lives in the main admin CRM as the "Tap Cards" tab.
export default function CardAdminRedirect() {
  redirect('/en/admin?tab=cards');
}
