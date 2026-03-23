'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import withAdminLayout from './withAdminLayout';
import AdminBlogEditor from './AdminBlogEditor';

interface Props { editId?: string; }

const WrappedEditor = withAdminLayout(AdminBlogEditor);

function EditorInner({ editId }: Props) {
  const searchParams = useSearchParams();
  const id = editId ?? searchParams.get('id') ?? undefined;
  return <WrappedEditor editId={id} />;
}

export default function AdminBlogEditorWrapper({ editId }: Props) {
  return (
    <Suspense fallback={<div className="spinner" />}>
      <EditorInner editId={editId} />
    </Suspense>
  );
}
