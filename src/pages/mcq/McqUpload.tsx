import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/Button';
import './McqUpload.css';

interface SavedTest {
  title: string;
  url: string;
  slug: string;
  createdAt: string;
}

const STORAGE_KEY = 'mcq_saved_tests';

const getSavedTests = (): SavedTest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTests = (tests: SavedTest[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
};

export const McqUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState('.json');
  const [testTitle, setTestTitle] = useState('');
  const [titleSaved, setTitleSaved] = useState(false);
  const [copyText, setCopyText] = useState('Copy');
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved tests from localStorage on mount
  useEffect(() => {
    setSavedTests(getSavedTests());
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownloadTemplate = () => {
    const templateContent = `[
  {
    "question": "Which method is used to serialize an object into a JSON string in JavaScript?",
    "options": [
      "JSON.parse()",
      "JSON.stringify()",
      "Object.serialize()",
      "String.toJSON()"
    ],
    "answer": "JSON.stringify()"
  }
]`;
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcq_template${downloadFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
      setError('Please upload a valid .json or .txt file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json) || json.length === 0 || !json[0].question || !json[0].options || !json[0].answer) {
        throw new Error('Invalid JSON format. Expected an array of objects with "question", "options", and "answer".');
      }

      const response = await fetch('/api/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });

      const data = await response.json();

      if (data.success && data.slug) {
        const url = `${window.location.origin}/mcq/${data.slug}`;
        setShareableUrl(url);
        setCurrentSlug(data.slug);
        setTestTitle('');
        setTitleSaved(false);
      } else {
        throw new Error(data.error || 'Failed to upload MCQ data');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing file. Ensure it contains valid JSON.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 2000);
  };

  const handleSaveTitle = () => {
    if (!testTitle.trim() || !shareableUrl || !currentSlug) return;

    const newTest: SavedTest = {
      title: testTitle.trim(),
      url: shareableUrl,
      slug: currentSlug,
      createdAt: new Date().toISOString()
    };

    const updated = [newTest, ...savedTests];
    saveTests(updated);
    setSavedTests(updated);
    setTitleSaved(true);
  };

  const handleDeleteTest = (slug: string) => {
    const updated = savedTests.filter(t => t.slug !== slug);
    saveTests(updated);
    setSavedTests(updated);
  };

  const handleHistoryCopy = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    // Briefly show feedback by changing button text
    const btn = document.getElementById(`copy-${slug}`);
    if (btn) {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }
  };

  return (
    <div className="mcq-upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>Create MCQ Assessment</h1>
          <p>Upload a JSON file containing your multiple choice questions to generate a shareable test link.</p>
        </div>

        <div className="template-download-section">
          <p>Need a format template?</p>
          <div className="download-controls">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="format-select"
            >
              <option value=".json">.json</option>
              <option value=".txt">.txt</option>
            </select>
            <Button variant="secondary" onClick={handleDownloadTemplate} style={{ height: '48px' }}>
              Download Example
            </Button>
          </div>
        </div>

        {!shareableUrl && (
          <div
            className={`drop-zone ${isDragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept=".json,.txt"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="drop-zone-text">
              {isUploading ? 'Uploading...' : 'Click to Upload or Drag and Drop'}
            </div>
            <div className="drop-zone-subtext">Supports .json and .txt files (Max 5MB)</div>
          </div>
        )}

        {error && (
          <div style={{ color: '#EF4444', marginTop: '16px', fontWeight: 500, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {shareableUrl && (
          <div className="upload-result">
            <h3 style={{ color: '#FFFFFF' }}>Upload Successful!</h3>

            {/* Title Input */}
            <div className="title-input-row">
              <input
                type="text"
                className="title-input"
                placeholder="Enter a title for this test (e.g., Java Collections Quiz)"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                disabled={titleSaved}
              />
              <Button
                variant="primary"
                onClick={handleSaveTitle}
                style={{ height: '50px', whiteSpace: 'nowrap' }}
                disabled={titleSaved || !testTitle.trim()}
              >
                {titleSaved ? 'Saved ✓' : 'Save'}
              </Button>
            </div>

            {/* URL with Copy & Open */}
            <div className="url-display-row">
              <span>{shareableUrl}</span>
              <button className="copy-btn" onClick={() => window.open(shareableUrl, '_blank')}>
                Open
              </button>
              <button className="copy-btn" onClick={() => handleCopyUrl(shareableUrl)}>
                {copyText}
              </button>
            </div>

            <Button variant="primary" onClick={() => {
              setShareableUrl(null);
              setCurrentSlug(null);
              setError(null);
              setTestTitle('');
              setTitleSaved(false);
            }} style={{ marginTop: '8px' }}>
              Upload Another File
            </Button>
          </div>
        )}

        {/* Saved Tests History */}
        <div className="history-section">
          <h2>Your Created Tests</h2>
          {savedTests.length === 0 ? (
            <div className="no-history">
              No tests created yet. Upload a JSON file above to get started.
            </div>
          ) : (
            <div className="history-list">
              {savedTests.map((test) => (
                <div className="history-item" key={test.slug}>
                  <div className="history-item-info">
                    <div className="history-item-title">{test.title}</div>
                    <a href={test.url} target="_blank" rel="noreferrer" className="history-item-url">
                      {test.url}
                    </a>
                  </div>
                  <div className="history-item-actions">
                    <button
                      className="history-copy-btn"
                      onClick={() => window.open(test.url, '_blank')}
                    >
                      Open
                    </button>
                    <button
                      className="history-copy-btn"
                      id={`copy-${test.slug}`}
                      onClick={() => handleHistoryCopy(test.url, test.slug)}
                    >
                      Copy
                    </button>
                    <button
                      className="history-delete-btn"
                      onClick={() => handleDeleteTest(test.slug)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
