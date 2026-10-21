import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Image, Upload, Trash2, Copy, Check, RefreshCw } from 'lucide-react';

export default function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 });
  const [copiedId, setCopiedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const loadMedia = async () => {
    try {
      const data = await api.get('/admin/media');
      setMedia(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleDeviceFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      alert('Please select valid image files.');
      return;
    }

    setUploading(true);
    setUploadCount({ current: 0, total: fileList.length });

    try {
      for (let i = 0; i < fileList.length; i++) {
        setUploadCount({ current: i + 1, total: fileList.length });
        const fd = new FormData();
        fd.append('file', fileList[i]);
        fd.append('folder', 'uploads');
        await api.postForm('/admin/media', fd);
      }
      await loadMedia();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      setUploadCount({ current: 0, total: 0 });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this media file?')) return;
    try {
      await api.delete(`/admin/media/${id}`);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Media Assets & Library</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
            Central repository for bag photography, material swatches, and banners — uploaded directly from device
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadMedia}
            disabled={loading || uploading}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={15} /> {uploading ? `Uploading ${uploadCount.current}/${uploadCount.total}...` : 'Upload From Device'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={e => handleDeviceFilesUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer?.files) handleDeviceFilesUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed var(--accent)' : '2px dashed var(--border)',
          background: isDragging ? 'var(--accent-soft)' : 'var(--bg-secondary)',
          borderRadius: 8,
          padding: '24px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 20,
          transition: 'all 0.2s ease',
        }}
      >
        <Upload size={28} style={{ color: 'var(--accent)', margin: '0 auto 8px', opacity: 0.9 }} />
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          {uploading
            ? `Uploading ${uploadCount.current} of ${uploadCount.total} files directly from device...`
            : 'Tap or drag & drop images here to upload directly from your device'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Select multiple photos from phone gallery, camera, or desktop folder
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : media.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Image size={48} style={{ opacity: 0.4, marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 500 }}>No uploaded media files yet</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Click "Upload From Device" above to upload high-res bag photos</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, padding: 16 }}>
            {media.map(m => (
              <div
                key={m.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: 130, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={m.url}
                    alt={m.original_name || m.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.opacity = '0.3'; }}
                  />
                </div>
                <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }} title={m.original_name || m.filename}>
                    {m.original_name || m.filename}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => handleCopy(m.url, m.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 10, padding: '2px 6px' }}
                    >
                      {copiedId === m.id ? <Check size={11} color="var(--success)" /> : <Copy size={11} />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}
                      title="Delete image"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
