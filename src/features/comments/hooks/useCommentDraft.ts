import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface UseCommentDraftProps {
  incidentId: string;
  autoSaveDelay?: number;
}

export const useCommentDraft = ({ incidentId, autoSaveDelay = 1000 }: UseCommentDraftProps) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const debouncedContent = useDebounce(content, autoSaveDelay);

  // Загружаем черновик при монтировании
  useEffect(() => {
    const loadDraft = () => {
      try {
        const drafts = JSON.parse(localStorage.getItem('comment_drafts') || '{}');
        const savedDraft = drafts[incidentId];
        
        if (savedDraft) {
          setContent(savedDraft.content);
          setLastSaved(new Date(savedDraft.timestamp));
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    };

    loadDraft();
  }, [incidentId]);

  // Автосохранение черновика
  useEffect(() => {
    const saveDraft = async () => {
      if (!debouncedContent.trim()) {
        // Если черновик пустой, удаляем его
        try {
          const drafts = JSON.parse(localStorage.getItem('comment_drafts') || '{}');
          delete drafts[incidentId];
          localStorage.setItem('comment_drafts', JSON.stringify(drafts));
          setLastSaved(null);
        } catch (error) {
          console.error('Failed to remove draft:', error);
        }
        return;
      }

      setIsSaving(true);
      
      try {
        const drafts = JSON.parse(localStorage.getItem('comment_drafts') || '{}');
        drafts[incidentId] = {
          content: debouncedContent,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('comment_drafts', JSON.stringify(drafts));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to save draft:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveDraft();
  }, [debouncedContent, incidentId]);

  // Очистка черновика после успешной отправки
  const clearDraft = useCallback(() => {
    try {
      const drafts = JSON.parse(localStorage.getItem('comment_drafts') || '{}');
      delete drafts[incidentId];
      localStorage.setItem('comment_drafts', JSON.stringify(drafts));
      setContent('');
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [incidentId]);

  return {
    content,
    setContent,
    clearDraft,
    isSaving,
    lastSaved,
    hasDraft: content.trim().length > 0,
  };
};