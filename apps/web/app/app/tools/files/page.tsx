'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

type FileItem = { id: string; name: string; contentText: string };

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const load = () => {
    apiFetch<FileItem[]>('/portal/tools/files').then(setFiles);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/portal/tools/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contentText: content })
    });
    setName('');
    setContent('');
    load();
  };

  return (
    <PageFrame
      title="Files"
      description="Lista e upload simples"
      permissions={['TOOL_FILES_READ', 'TOOL_FILES_WRITE']}
      toolKey="files"
    >
      <form onSubmit={create} data-testid="file-create-form">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
        <button type="submit">Upload</button>
      </form>
      <ul data-testid="files-list">
        {files.map((f) => (
          <li key={f.id}>
            <strong>{f.name}</strong>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
