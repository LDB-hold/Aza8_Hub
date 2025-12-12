'use client';

import { PageFrame } from '../../../components/PageFrame';

export default function ProfilePage() {
  return (
    <PageFrame title="Profile" description="Dados do usuário" permissions={['PORTAL_DASHBOARD_VIEW']}>
      <p>Perfil mínimo exibido a partir do /auth/me.</p>
    </PageFrame>
  );
}
