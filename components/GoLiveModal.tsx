// components/GoLiveModal.tsx
"use client";

import { LiveSession } from "@/src/types";

interface GoLiveModalProps {
  session: LiveSession;
  onClose: () => void;
  onEndSession: () => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ session, onClose, onEndSession }) => {
  // Your RTMP base URL from the .env file
  const rtmpBaseUrl = "rtmp://3.89.59.9/live";
  // The stream key is the unique part of the ingestUrl
  const streamKey = session.ingestUrl.replace(rtmpBaseUrl + '/', '');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a small toast notification here for user feedback
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Live Session Started!</h2>
        <p className="mb-6 text-gray-600">
          Enter the following details into your streaming software (like OBS) to start broadcasting.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Server URL</label>
            <div className="flex">
              <input type="text" readOnly value={rtmpBaseUrl} className="w-full p-2 border rounded-l-md bg-gray-100" />
              <button onClick={() => copyToClipboard(rtmpBaseUrl)} className="px-3 bg-gray-200 border border-l-0 rounded-r-md">Copy</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stream Key</label>
            <div className="flex">
              <input type="text" readOnly value={streamKey} className="w-full p-2 border rounded-l-md bg-gray-100" />
              <button onClick={() => copyToClipboard(streamKey)} className="px-3 bg-gray-200 border border-l-0 rounded-r-md">Copy</button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
          <button onClick={onEndSession} className="px-4 py-2 bg-red-600 text-white rounded-md">End Session</button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;