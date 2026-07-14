import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../shared/components/DashboardLayout';
import {
  FiRefreshCw,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiStar,
  FiLink,
  FiX,
  FiSend,
  FiPaperclip,
} from 'react-icons/fi';
import ApproveModal from '../../shared/components/ApproveModal';

// ─── Mock data import (replace with API call when backend is ready) ──────────
// Backend: GET /api/applications/:id
import { MOCK_APPLICATION_DETAIL } from '../../data/mockData';

// ─── Feedback History Panel ──────────────────────────────────────────────────

function FeedbackPanel({ onClose }) {
  const [message, setMessage] = useState('');

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-40 flex flex-col">
      {/* Close button - top right */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <div className="px-5 pb-4">
        <h3 className="text-xl font-bold text-gray-900">Feedback</h3>
      </div>

      {/* Yellow card — fills remaining space */}
      <div className="flex-1 mx-4 mb-4 bg-[#FFF9C4] rounded-2xl flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {MOCK_APPLICATION_DETAIL.feedbackHistory.map((fb) => (
            <div key={fb.id} className="flex flex-col gap-1">
              {fb.title && (
                <p className="text-sm font-bold text-gray-900 text-right">{fb.title}</p>
              )}
              {fb.sender && (
                <p className="text-xs text-gray-600 text-right">{fb.sender}</p>
              )}
              <p className="text-sm text-gray-700 leading-relaxed mt-1">{fb.body}</p>
              <p className="text-xs text-gray-500 text-right mt-1">
                — {fb.author} | {fb.date}
              </p>
              <hr className="border-yellow-300 mt-2" />
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="px-4 py-3 flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none italic"
          />
          <button 
            onClick={() => {
              // TODO(Backend): POST /api/applications/${router.query.id}/feedback with { message }
              if (message) {
                console.log('Sending message:', message);
                setMessage('');
              }
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sticky Note Tooltip ─────────────────────────────────────────────────────

function StickyNote({ note, onClose }) {
  return (
    <div className="fixed top-16 right-6 z-30 w-[220px] bg-[#FFF7B3] rounded-xl shadow-xl p-4">
      {/* Pin icon */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-600 text-lg">📌</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-sm font-bold text-gray-900">{note.company}</p>
      <p className="text-xs text-gray-600 mb-3">{note.role}</p>
      <p className="text-xs text-gray-500">
        — {note.author} &nbsp; {note.date}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const router = useRouter();
  // TODO(Backend): Fetch application by ID using GET /api/applications/${router.query.id}
  // Data structure should match the mock MOCK_APPLICATION_DETAIL object in mockData.js.
  const app = MOCK_APPLICATION_DETAIL;

  const [showStickyNote, setShowStickyNote] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Job Application ({app.company}) | ApplyLoop</title>
        <meta name="description" content={`Job application for ${app.role} at ${app.company}`} />
      </Head>

      <DashboardLayout>
        <div className="max-w-3xl relative">
          {/* ── Sticky note trigger ── */}
          {!showStickyNote && (
            <button 
              onClick={() => setShowStickyNote(true)}
              className="absolute -right-16 top-6 w-10 h-10 flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
            >
              <span className="text-2xl drop-shadow-md">📌</span>
            </button>
          )}

          {/* ── Sticky note overlay ── */}
          {showStickyNote && (
            <StickyNote note={app.stickyNote} onClose={() => setShowStickyNote(false)} />
          )}

          {/* ── Info table ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 mb-5">
            {/* Approve / Send Feedback buttons */}
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={() => setIsApproveModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#1E50C3] text-white text-sm font-semibold hover:bg-[#1A45A7] transition-colors"
              >
                Approve Application
              </button>
              <button
                onClick={() => setShowFeedback(true)}
                className="px-5 py-2.5 rounded-xl border border-[#1E50C3] text-[#1E50C3] text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Send Feedback
              </button>
            </div>

            {/* Fields */}
            <div className="divide-y divide-gray-100">
              {/* Status */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiRefreshCw className="w-4 h-4 flex-shrink-0" />
                  Status
                </div>
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                  {app.status}
                </span>
              </div>

              {/* Role */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiBriefcase className="w-4 h-4 flex-shrink-0" />
                  Role
                </div>
                <span className="text-sm text-gray-800">{app.role}</span>
              </div>

              {/* Dates */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  Dates
                </div>
                <span className="text-sm text-gray-800">{app.date}</span>
              </div>

              {/* Application Time */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiClock className="w-4 h-4 flex-shrink-0" />
                  Application Time
                </div>
                <span className="text-sm text-gray-800">{app.applicationTime}</span>
              </div>

              {/* Preferences */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiStar className="w-4 h-4 flex-shrink-0" />
                  Preferences
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.preferences.map((p) => (
                    <span
                      key={p.label}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${p.color}`}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job Link */}
              <div className="flex items-center py-3 gap-6">
                <div className="flex items-center gap-2 w-44 text-sm text-gray-500">
                  <FiLink className="w-4 h-4 flex-shrink-0" />
                  Job Link
                </div>
                <a
                  href={`https://${app.jobLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1E50C3] hover:underline"
                >
                  {app.jobLink}
                </a>
              </div>
            </div>
          </div>

          {/* ── PDF Thumbnails ── */}
          <div className="flex gap-5 mb-5">
            {['Submitted Resume .pdf', 'Submitted Cover letter.pdf'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-2">
                {/* PDF Icon */}
                <div className="w-[120px] h-[140px] bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Red PDF badge */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow">
                    PDF
                  </div>
                  {/* Page lines decoration */}
                  <div className="mt-10 w-16 flex flex-col gap-1.5">
                    <div className="h-1 bg-gray-100 rounded" />
                    <div className="h-1 bg-gray-100 rounded" />
                    <div className="h-1 bg-gray-100 rounded w-3/4" />
                  </div>
                  {/* Folded corner */}
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100"
                    style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Job Details ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 mb-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Job Details
            </h3>
            <ul className="space-y-2">
              {app.jobDetails.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Qualities ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 mb-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Qualities and Characteristics
            </h3>
            <ul className="space-y-2">
              {app.qualities.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Other Details ── */}
          <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
              Other Details
            </h3>
            <ul className="space-y-2">
              {app.otherDetails.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Feedback History Side Panel ── */}
        {showFeedback && (
          <FeedbackPanel onClose={() => setShowFeedback(false)} />
        )}

        {/* ── Approve Modal ── */}
        <ApproveModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={() => {
            // TODO(Backend): Map to PUT /api/applications/${router.query.id}/approve
            console.log('Application approved!');
          }}
        />
      </DashboardLayout>
    </>
  );
}
