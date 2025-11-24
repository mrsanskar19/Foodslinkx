'use client';

import { useState, useEffect } from 'react';
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

export default function ContactFormPage() {
  const params = useParams();
  const { id, slug } = params;

  const [subject, setSubject] = useState<{ title: string; description: string } | null>(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const currentSubject = contactSubjects.find((s) => s.slug === slug);
    if (currentSubject) {
      setSubject(currentSubject);
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Here you would typically send the data to your API
    console.log({
      hotelId: id,
      subject: slug,
      email,
      message,
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Thank You!</h1>
        <p className="text-lg">Your request regarding "{subject?.title}" has been submitted. We will get back to you at your provided email shortly.</p>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Contact Support</h1>
        <p>Invalid contact reason selected.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
      <p className="text-gray-600 mb-6">{subject.description}</p>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Your Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder={`Please provide as much detail as possible.`}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
