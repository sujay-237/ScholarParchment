'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  HelpCircle,
  Search,
  BookOpen,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Verification Query');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Interactive AI Assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! I am the National Scholarship AI Assistant. How can I help you with your application, DigiLocker certificates, or DBT transfer today?',
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const faqs = [
    {
      id: 0,
      q: 'How does DigiLocker integration work with ScholarParchment?',
      a: 'ScholarParchment directly queries the National Academic Depository (NAD) and state revenue departments via DigiLocker APIs. Once you authenticate using your Aadhaar-linked mobile, certificates are verified electronically with tamper-proof digital seals, eliminating physical paper submissions.',
    },
    {
      id: 1,
      q: 'Why must my Bank Account be seeded with Aadhaar on NPCI?',
      a: 'The Direct Benefit Transfer (DBT) mandates payment clearance via the Aadhaar Payment Bridge System (APBS). Funds are routed to whichever bank account is active on the NPCI mapper, ensuring 0% intermediary delays and preventing fund misrouting.',
    },
    {
      id: 2,
      q: 'What is the role of my College Nodal Officer in the verification cycle?',
      a: 'Your educational institution verifies your bona fide regular student status, confirms that your classroom attendance meets the mandatory 75% threshold, and authenticates that your enrolled semester fee receipt is genuine before recommending your record to the Central Ministry.',
    },
    {
      id: 3,
      q: 'How can I verify the cryptographic authenticity of my scholarship sanction?',
      a: 'Every application stage transition emits a tamper-evident SHA-256 block hash recorded in the public ledger. You can inspect the digital signature certificate and transaction block hash directly in the "Verification Records" section.',
    },
    {
      id: 4,
      q: 'What should I do if my college nodal officer raises a query on my application?',
      a: 'You will receive an alert in your Notifications Center. Navigate to your Application Workspace, view the officer remarks, and furnish the requested clarification or additional certified PDF proof within the specified deadline.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    const newChat = [...chatMessages, { sender: 'user' as const, text: userText }];
    setChatMessages(newChat);
    setUserInput('');

    setTimeout(() => {
      let botResponse =
        'Your query has been analyzed against the central scholarship guidelines. If you are facing verification delays, ensure your college nodal officer has reviewed your bona fide record on the institute queue.';
      if (userText.toLowerCase().includes('dbt') || userText.toLowerCase().includes('bank')) {
        botResponse =
          'To ensure seamless DBT credit, verify that your State Bank of India account is seeded with Aadhaar in active status with NPCI mapper.';
      } else if (userText.toLowerCase().includes('income') || userText.toLowerCase().includes('limit')) {
        botResponse =
          'For PM-USP scheme, gross annual family income must be under ₹4.50 Lakh. For AICTE Pragati, the ceiling is ₹8.00 Lakh.';
      }

      setChatMessages([...newChat, { sender: 'bot', text: botResponse }]);
    }, 500);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">
                Help & Support Center
              </h1>
              <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full font-label">
                24x7 Assistance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              Official guidelines, FAQs, automated query assistant, and grievance redressal cell.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/50 flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-bold text-on-surface font-mono">1800-118-005 (Toll-Free)</span>
            </div>
          </div>
        </div>

        {/* FAQs & AI Chatbot Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Knowledge Base & FAQs (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base (e.g. DigiLocker, NPCI, Attendance, Sanction)..."
                className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs sm:text-sm text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg font-headline text-on-surface flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="p-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full flex justify-between items-center text-left text-xs sm:text-sm font-bold font-headline text-on-surface"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-secondary shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-3 pt-3 border-t border-surface-container">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grievance Ticket Submission */}
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-surface-container">
                <h3 className="font-bold text-base font-headline text-on-surface">
                  Submit Grievance or Support Ticket
                </h3>
                <span className="text-[10px] text-secondary font-label uppercase">
                  Central Redressal System
                </span>
              </div>

              {!ticketSubmitted ? (
                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Issue Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                    >
                      <option>Verification Query / Delay</option>
                      <option>Aadhaar DBT Bank Linking Issue</option>
                      <option>DigiLocker Document Retrieval Error</option>
                      <option>Sanction Order Discrepancy</option>
                      <option>General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief summary of your grievance..."
                      className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Include your application ID and exact issue details..."
                      className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
                  >
                    Submit Grievance Ticket
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-xs text-emerald-950">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Grievance Ticket Lodged: #GRV-2026-8819</p>
                  <p className="text-secondary text-[11px]">
                    Your grievance has been assigned to the Nodal Grievance Officer. Resolution will be provided within 48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setTicketSubmitted(false);
                      setTicketSubject('');
                      setTicketMessage('');
                    }}
                    className="text-primary font-semibold hover:underline text-xs"
                  >
                    Submit another ticket
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Scholarship Assistant Chat (Col 5) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-md flex flex-col h-[600px] justify-between">
              {/* Chat Header */}
              <div className="pb-3 border-b border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-headline text-on-surface">
                      ScholarParchment AI Assistant
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-semibold">● Online • Govt Guidelines Trained</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-none'
                          : 'bg-surface-container-low text-on-surface border border-outline-variant/40 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-surface-container flex items-center gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask a question about schemes, documents..."
                  className="flex-1 px-3.5 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
