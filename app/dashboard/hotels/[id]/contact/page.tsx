'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';

const contactSubjects = [
  {
    slug: 'verify-my-hotel',
    title: 'Verify My Hotel',
    description: 'Request to have your hotel verified on our platform.',
  },
  {
    slug: 'remove-my-hotel',
    title: 'Remove My Hotel',
    description: 'Request to have your hotel data removed from our platform.',
  },
  {
    slug: 'technical-issue',
    title: 'Technical Issue',
    description: 'Report a technical issue with your hotel dashboard or listing.',
  },
  {
    slug: 'other',
    title: 'Other',
    description: 'For any other inquiries, please use this option.',
  },
];

export default function ContactPage() {
    const params = useParams();
    const { id } = params;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Contact Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactSubjects.map((subject) => (
          <Link key={subject.slug} href={`/dashboard/hotels/${id}/contact/${subject.slug}`}>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h2 className="text-lg font-semibold">{subject.title}</h2>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
