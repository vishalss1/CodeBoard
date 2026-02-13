import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../features/posts/posts.api';
import AppLayout from '../components/layout/AppLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './CreatePostPage.css';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go',
  'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'HTML', 'CSS', 'SQL', 'Other',
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!editId);

  useEffect(() => {
    if (!editId) return;
    const load = async () => {
      try {
        const post = await getPost(editId);
        setTitle(post.title);
        setLanguage(post.language);
        setCode(post.code);
      } catch {
        setError('Failed to load post for editing');
      } finally {
        setIsFetching(false);
      }
    };
    load();
  }, [editId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      setError('Title and code are required');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editId) {
        await updatePost(editId, { title, code, language });
        navigate(`/posts/${editId}`);
      } else {
        const result = await createPost({ title, code, language });
        navigate(`/posts/${result.post_id}`);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message ?? 'Failed to save post');
      } else {
        setError('Failed to save post');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AppLayout>
        <div className="flex-center" style={{ minHeight: '60vh' }}>
          <div className="spinner spinner-lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="create-post animate-fade-in">
        <h1 className="create-post-title">{editId ? 'Edit Post' : 'Create a New Post'}</h1>
        <p className="create-post-subtitle">
          {editId ? 'Update your code snippet' : 'Share a code snippet with the community'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <Input
            label="Title"
            type="text"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="input-group">
            <label className="input-label" htmlFor="language-select">
              Language
            </label>
            <select
              id="language-select"
              className="create-post-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="code-textarea">
              Code
            </label>
            <textarea
              id="code-textarea"
              className="create-post-code"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              required
            />
          </div>

          <div className="create-post-actions">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editId ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
