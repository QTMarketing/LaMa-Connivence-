'use client';

import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';

export default function BlogEditorPage() {
  const params = useParams();
  const id = params.id as string;
  
  return <BlogEditor blogId={id} isNew={id === 'new'} />;
}
