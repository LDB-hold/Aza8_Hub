'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

type Task = { id: string; title: string; status: string };

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  const load = () => {
    apiFetch<Task[]>('/portal/tools/tasks').then(setTasks);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/portal/tools/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/portal/tools/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    load();
  };

  const remove = async (id: string) => {
    await apiFetch(`/portal/tools/tasks/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <PageFrame
      title="Tasks"
      description="Listar e criar tasks"
      permissions={['TOOL_TASKS_READ', 'TOOL_TASKS_WRITE']}
      toolKey="tasks"
    >
      <form onSubmit={create} data-testid="task-create-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
        <button type="submit">Criar</button>
      </form>
      <table data-testid="tasks-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => updateStatus(task.id, 'IN_PROGRESS')}>In progress</button>
                <button onClick={() => updateStatus(task.id, 'DONE')}>Done</button>
                <button onClick={() => remove(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
