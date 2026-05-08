'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

interface Chapter {
  id: string;
  title: string;
  description?: string;
  language: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  isFeatured?: boolean;
  isLocked?: boolean;
  unlocksAt?: string | null;
  order: number;
  subchapters?: Subchapter[];
}

interface Subchapter {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  isLocked?: boolean;
  unlocksAt?: string | null;
  order: number;
  vocabulary?: Vocabulary[];
}

interface Vocabulary {
  id: string;
  subchapterId: string;
  word: string;
  translation: string;
  example?: string;
  translatedExample?: string;
  order: number;
}

type Tab = 'chapters' | 'subchapters' | 'vocabulary';

const getLanguageName = (lang: string) => {
  switch(lang) {
    case 'de': return '🇩🇪 Deutsch';
    case 'en': return '🇬🇧 Englisch';
    case 'pt-br': return '🇧🇷 Portugiesisch';
    default: return lang;
  }
};

const getLanguageFlag = (lang: string) => {
  switch(lang) {
    case 'de': return '🇩🇪';
    case 'en': return '🇬🇧';
    case 'pt-br': return '🇧🇷';
    default: return '🌐';
  }
};

export function ContentManager() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('chapters');
  const [allChapters, setAllChapters] = useState<Chapter[]>([]); // All chapters without filter
  const [chapters, setChapters] = useState<Chapter[]>([]); // Filtered chapters
  const [languageCombinations, setLanguageCombinations] = useState<string[]>([]); // Available combinations
  const [subchapters, setSubchapters] = useState<Subchapter[]>([]);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedSubchapterId, setSelectedSubchapterId] = useState<string>('');
  const [filterCombination, setFilterCombination] = useState<string>('de|pt-br'); // Format: sourceLanguage|targetLanguage

  // Helper to parse combination string
  const parseCombination = (combo: string): [string, string] => {
    const idx = combo.indexOf('|');
    if (idx === -1) return ['de', 'pt-br'];
    return [combo.substring(0, idx), combo.substring(idx + 1)];
  };

  // Chapter form
  const [chapterForm, setChapterForm] = useState({
    id: '',
    title: '',
    description: '',
    language: language,
    sourceLanguage: parseCombination('de|pt-br')[0],
    targetLanguage: parseCombination('de|pt-br')[1],
    isFeatured: false,
    isLocked: false,
    unlocksAt: '',
    insertAfterChapterId: '', // For ordering dropdown
    order: '',
  });

  // Subchapter form
  const [subchapterForm, setSubchapterForm] = useState({
    id: '',
    chapterId: '',
    title: '',
    description: '',
    isLocked: false,
    unlocksAt: '',
    insertAfterSubchapterId: '', // For ordering dropdown
    order: '',
  });

  // Vocabulary form
  const [vocabularyForm, setVocabularyForm] = useState({
    id: '',
    subchapterId: '',
    word: '',
    translation: '',
    example: '',
    translatedExample: '',
    order: '',
  });

  // Load all chapters (without filter)
  const loadAllChapters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/chapters', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const loadedChapters = data.chapters || [];
        setAllChapters(loadedChapters);
        
        // Extract unique language combinations
        const combinations = new Set<string>();
        loadedChapters.forEach((chapter: Chapter) => {
          const source = chapter.sourceLanguage || 'de';
          const target = chapter.targetLanguage || chapter.language;
          combinations.add(`${source}|${target}`);
        });
        const combosArray = Array.from(combinations).sort();
        setLanguageCombinations(combosArray);
        
        // Auto-select first available combination if current filter has no matches
        const currentHasMatches = loadedChapters.some((ch: Chapter) => {
          const [s, t] = parseCombination(filterCombination);
          return (ch.sourceLanguage || 'de') === s && (ch.targetLanguage || ch.language) === t;
        });
        if (!currentHasMatches && combosArray.length > 0) {
          setFilterCombination(combosArray[0]);
          filterChapters(loadedChapters, combosArray[0]);
        } else {
          filterChapters(loadedChapters, filterCombination);
        }
      }
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter chapters by language combination
  const filterChapters = (chaptersToFilter: Chapter[], combination: string) => {
    const [source, target] = parseCombination(combination);
    const filtered = chaptersToFilter.filter(chapter => {
      const chapterSource = chapter.sourceLanguage || 'de';
      const chapterTarget = chapter.targetLanguage || chapter.language;
      return chapterSource === source && chapterTarget === target;
    });
    setChapters(filtered);
  };

  // Load subchapters
  const loadSubchapters = async (chapterId?: string) => {
    setIsLoading(true);
    try {
      const url = chapterId 
        ? `/api/admin/subchapters?chapterId=${chapterId}`
        : '/api/admin/subchapters';
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSubchapters(data.subchapters || []);
      }
    } catch (error) {
      console.error('Failed to load subchapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load vocabulary
  const loadVocabulary = async (subchapterId?: string) => {
    setIsLoading(true);
    try {
      const url = subchapterId 
        ? `/api/admin/vocabulary?subchapterId=${subchapterId}`
        : '/api/admin/vocabulary';
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setVocabulary(data.vocabulary || []);
      }
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllChapters();
  }, []);

  useEffect(() => {
    // Apply filter when combination changes
    if (allChapters.length > 0) {
      filterChapters(allChapters, filterCombination);
    }
  }, [filterCombination, allChapters]);

  useEffect(() => {
    if (selectedChapterId) {
      loadSubchapters(selectedChapterId);
    }
  }, [selectedChapterId]);

  useEffect(() => {
    if (selectedSubchapterId) {
      loadVocabulary(selectedSubchapterId);
    }
  }, [selectedSubchapterId]);

  // Chapter handlers
  const handleSaveChapter = async () => {
    setIsSaving(true);
    try {
      const isEdit = !!chapterForm.id;
      const url = isEdit 
        ? `/api/admin/chapters/${chapterForm.id}`
        : '/api/admin/chapters';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: chapterForm.title,
          description: chapterForm.description || null,
          language: chapterForm.language,
          sourceLanguage: chapterForm.sourceLanguage,
          targetLanguage: chapterForm.targetLanguage,
          isFeatured: chapterForm.isFeatured,
          isLocked: chapterForm.isLocked,
          unlocksAt: chapterForm.unlocksAt ? new Date(chapterForm.unlocksAt).toISOString() : null,
          insertAfterChapterId: chapterForm.insertAfterChapterId || undefined,
          order: chapterForm.order ? parseInt(chapterForm.order) : undefined,
        }),
      });

      if (response.ok) {
        await loadAllChapters();
        resetChapterForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Failed to save chapter:', error);
      alert('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditChapter = (chapter: Chapter) => {
    setChapterForm({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description || '',
      language: chapter.language as any,
      sourceLanguage: chapter.sourceLanguage || 'de',
      targetLanguage: chapter.targetLanguage || chapter.language,
      isFeatured: chapter.isFeatured || false,
      isLocked: chapter.isLocked || false,
      unlocksAt: chapter.unlocksAt ? new Date(chapter.unlocksAt).toISOString().split('T')[0] : '',
      insertAfterChapterId: '',
      order: chapter.order.toString(),
    });
  };

  const handleDeleteChapter = async (id: string) => {
    if (!confirm('Kapitel wirklich löschen? Alle Unterkapitel und Vokabeln werden ebenfalls gelöscht!')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/chapters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await loadAllChapters();
      }
    } catch (error) {
      console.error('Failed to delete chapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetChapterForm = () => {
    setChapterForm({
      id: '',
      title: '',
      description: '',
      language: (parseCombination(filterCombination)[1] || language) as any,
      sourceLanguage: parseCombination(filterCombination)[0] || 'de',
      targetLanguage: parseCombination(filterCombination)[1] || language,
      isFeatured: false,
      isLocked: false,
      unlocksAt: '',
      insertAfterChapterId: '',
      order: '',
    });
  };

  // Keep chapter form language in sync with filter combination
  useEffect(() => {
    if (!chapterForm.id) {
      const [source, target] = parseCombination(filterCombination);
      setChapterForm(prev => ({ 
        ...prev, 
        language: target as any,
        sourceLanguage: source,
        targetLanguage: target 
      }));
    }
  }, [filterCombination]);

  // Subchapter handlers
  const handleSaveSubchapter = async () => {
    setIsSaving(true);
    try {
      const isEdit = !!subchapterForm.id;
      const url = isEdit 
        ? `/api/admin/subchapters/${subchapterForm.id}`
        : '/api/admin/subchapters';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          chapterId: subchapterForm.chapterId,
          title: subchapterForm.title,
          description: subchapterForm.description || null,
          isLocked: subchapterForm.isLocked,
          unlocksAt: subchapterForm.unlocksAt ? new Date(subchapterForm.unlocksAt).toISOString() : null,
          insertAfterSubchapterId: subchapterForm.insertAfterSubchapterId || undefined,
          order: subchapterForm.order ? parseInt(subchapterForm.order) : undefined,
        }),
      });

      if (response.ok) {
        await loadSubchapters(selectedChapterId);
        resetSubchapterForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Failed to save subchapter:', error);
      alert('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubchapter = (subchapter: Subchapter) => {
    setSubchapterForm({
      id: subchapter.id,
      chapterId: subchapter.chapterId,
      title: subchapter.title,
      description: subchapter.description || '',
      isLocked: subchapter.isLocked || false,
      unlocksAt: subchapter.unlocksAt ? new Date(subchapter.unlocksAt).toISOString().split('T')[0] : '',
      insertAfterSubchapterId: '',
      order: subchapter.order.toString(),
    });
  };

  const handleDeleteSubchapter = async (id: string) => {
    if (!confirm('Unterkapitel wirklich löschen? Alle Vokabeln werden ebenfalls gelöscht!')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/subchapters/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await loadSubchapters(selectedChapterId);
      }
    } catch (error) {
      console.error('Failed to delete subchapter:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSubchapterForm = () => {
    setSubchapterForm({
      id: '',
      chapterId: selectedChapterId || '',
      title: '',
      description: '',
      isLocked: false,
      unlocksAt: '',
      insertAfterSubchapterId: '',
      order: '',
    });
  };

  // Vocabulary handlers
  const handleSaveVocabulary = async () => {
    setIsSaving(true);
    try {
      const isEdit = !!vocabularyForm.id;
      const url = isEdit 
        ? `/api/admin/vocabulary/${vocabularyForm.id}`
        : '/api/admin/vocabulary';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subchapterId: vocabularyForm.subchapterId,
          word: vocabularyForm.word,
          translation: vocabularyForm.translation,
          example: vocabularyForm.example || null,
          translatedExample: vocabularyForm.translatedExample || null,
          order: vocabularyForm.order ? parseInt(vocabularyForm.order) : undefined,
        }),
      });

      if (response.ok) {
        await loadVocabulary(selectedSubchapterId);
        resetVocabularyForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Failed to save vocabulary:', error);
      alert('Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditVocabulary = (vocab: Vocabulary) => {
    setVocabularyForm({
      id: vocab.id,
      subchapterId: vocab.subchapterId,
      word: vocab.word,
      translation: vocab.translation,
      example: vocab.example || '',
      translatedExample: vocab.translatedExample || '',
      order: vocab.order.toString(),
    });
  };

  const handleDeleteVocabulary = async (id: string) => {
    if (!confirm('Vokabel wirklich löschen?')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/vocabulary/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await loadVocabulary(selectedSubchapterId);
      }
    } catch (error) {
      console.error('Failed to delete vocabulary:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetVocabularyForm = () => {
    setVocabularyForm({
      id: '',
      subchapterId: selectedSubchapterId || '',
      word: '',
      translation: '',
      example: '',
      translatedExample: '',
      order: '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Inhaltsverwaltung</h2>
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {(() => {
            const [source, target] = parseCombination(filterCombination);
            return (
              <>
                <span className="text-2xl">{getLanguageFlag(source)}</span>
                <span className="text-xl">→</span>
                <span className="text-2xl">{getLanguageFlag(target)}</span>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Sprachkombination: {getLanguageName(source)} → {getLanguageName(target)}
                  </p>
                  <p className="text-xs text-blue-700">
                    Zeigt alle Inhalte für diese Sprachrichtung
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'chapters'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('chapters')}
        >
          📖 Kapitel
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'subchapters'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('subchapters')}
        >
          📑 Unterkapitel
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'vocabulary'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('vocabulary')}
        >
          📚 Vokabeln
        </button>
      </div>

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <div>
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              🌍 Sprachkombination auswählen
            </label>
            <select
              className="w-full md:w-auto px-4 py-2 text-base border-2 border-purple-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filterCombination}
              onChange={(e) => {
                setFilterCombination(e.target.value);
                setSelectedChapterId('');
                const [source, target] = parseCombination(e.target.value);
                setChapterForm({ 
                  ...chapterForm, 
                  language: target as any,
                  sourceLanguage: source,
                  targetLanguage: target 
                });
              }}
            >
              {languageCombinations.length === 0 ? (
                <option value="de|pt-br">🇩🇪 Deutsch → 🇧🇷 Portugiesisch (Keine Kapitel vorhanden)</option>
              ) : (
                languageCombinations.map(combo => {
                  const [source, target] = parseCombination(combo);
                  const getFullName = (lang: string) => {
                    switch(lang) {
                      case 'de': return 'Deutsch';
                      case 'en': return 'Englisch';
                      case 'pt-br': return 'Portugiesisch';
                      default: return lang;
                    }
                  };
                  return (
                    <option key={combo} value={combo}>
                      {getLanguageFlag(source)} {getFullName(source)} → {getLanguageFlag(target)} {getFullName(target)}
                    </option>
                  );
                })
              )}
            </select>
            <p className="mt-2 text-xs text-gray-600">
              Zeigt nur Kapitel für die ausgewählte Sprachkombination
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {chapterForm.id ? '✏️ Kapitel bearbeiten' : '➕ Neues Kapitel erstellen'}
            </h3>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                💡 <strong>Hinweis:</strong> Der Kapiteltitel sollte in der <strong>Ausgangssprache</strong> ({getLanguageName(chapterForm.sourceLanguage)}) geschrieben werden, 
                damit die Lernenden das Kapitel in ihrer Muttersprache verstehen.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getLanguageFlag(chapterForm.sourceLanguage)} Kapiteltitel in {getLanguageName(chapterForm.sourceLanguage)}*
                </label>
                <input
                  type="text"
                  placeholder={chapterForm.sourceLanguage === 'de' ? 'z.B. Begrüßungen' : chapterForm.sourceLanguage === 'en' ? 'e.g. Greetings' : 'p.ex. Cumprimentos'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                />
              </div>
              <input
                type="number"
                placeholder="Reihenfolge (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={chapterForm.order}
                onChange={(e) => setChapterForm({ ...chapterForm, order: e.target.value })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🌐 Ausgangssprache (Interface/Benutzersprache)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={chapterForm.sourceLanguage}
                  onChange={(e) => setChapterForm({ ...chapterForm, sourceLanguage: e.target.value })}
                >
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="en">🇬🇧 Englisch</option>
                  <option value="pt-br">🇧🇷 Portugiesisch</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Sprache des Benutzers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🎯 Zielsprache (Was wird gelernt)
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={chapterForm.targetLanguage}
                  onChange={(e) => {
                    setChapterForm({ 
                      ...chapterForm, 
                      targetLanguage: e.target.value,
                      language: e.target.value as any // Keep language in sync for backwards compatibility
                    });
                  }}
                >
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="en">🇬🇧 Englisch</option>
                  <option value="pt-br">🇧🇷 Portugiesisch</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Sprache die gelernt wird</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {getLanguageFlag(chapterForm.sourceLanguage)} Beschreibung in {getLanguageName(chapterForm.sourceLanguage)} (optional)
                </label>
                <textarea
                  placeholder={chapterForm.sourceLanguage === 'de' ? 'z.B. Lerne grundlegende Begrüßungsformeln' : chapterForm.sourceLanguage === 'en' ? 'e.g. Learn basic greetings' : 'p.ex. Aprenda cumprimentos básicos'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📍 Position (Einfügen nach Kapitel)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={chapterForm.insertAfterChapterId}
                    onChange={(e) => setChapterForm({ ...chapterForm, insertAfterChapterId: e.target.value })}
                  >
                    <option value="">-- Am Anfang einfügen --</option>
                    {chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        #{ch.order} - {ch.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Neues Kapitel hinter diesem einfügen</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🔒 Verfügbarkeit
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={chapterForm.isLocked ? 'locked' : 'unlocked'}
                    onChange={(e) => setChapterForm({ ...chapterForm, isLocked: e.target.value === 'locked' })}
                  >
                    <option value="unlocked">✅ Verfügbar</option>
                    <option value="locked">🔒 Bald verfügbar (gesperrt)</option>
                  </select>
                </div>
              </div>

              {chapterForm.isLocked && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📅 Automatische Freischaltung (optional)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={chapterForm.unlocksAt}
                    onChange={(e) => setChapterForm({ ...chapterForm, unlocksAt: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Wählen Sie ein Datum, um das Kapitel automatisch freizuschalten. Lassen Sie dieses Feld leer für manuelle Freischaltung.</p>
                </div>
              )}

              <div className="md:col-span-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    checked={chapterForm.isFeatured}
                    onChange={(e) => setChapterForm({ ...chapterForm, isFeatured: e.target.checked })}
                  />
                  <div>
                    <span className="font-medium text-gray-900">⭐ Als neues Angebot auf Dashboard bewerben</span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Dieses Kapitel wird als Banner auf dem Dashboard angezeigt, um neue Lernsprachen zu bewerben
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSaveChapter} isLoading={isSaving}>
                {chapterForm.id ? '💾 Aktualisieren' : '✨ Erstellen'}
              </Button>
              {chapterForm.id && (
                <Button variant="secondary" onClick={resetChapterForm}>
                  ❌ Abbrechen
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              📖 Vorhandene Kapitel
            </h3>
            {isLoading ? (
              <p className="text-gray-600">⏳ Lädt...</p>
            ) : chapters.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">📭 Keine Kapitel vorhanden</p>
                <p className="text-sm text-gray-500 mt-1">Erstellen Sie Ihr erstes Kapitel für diese Sprachkombination</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${
                      chapter.isFeatured 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-lg font-bold text-blue-600">#{chapter.order}</span>
                        <p className="font-semibold text-gray-900">{chapter.title}</p>
                        {chapter.isFeatured && (
                          <span className="text-sm px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full font-medium flex items-center gap-1">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded">
                          {getLanguageFlag(chapter.sourceLanguage || 'de')} {(chapter.sourceLanguage || 'de').toUpperCase()}
                          <span className="mx-1">→</span>
                          {getLanguageFlag(chapter.targetLanguage || chapter.language)} {(chapter.targetLanguage || chapter.language).toUpperCase()}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>📑 {chapter.subchapters?.length || 0} Unterkapitel</span>
                      </div>
                      {chapter.description && (
                        <p className="text-sm text-gray-500 mt-1 italic">"{chapter.description}"</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="secondary" onClick={() => handleEditChapter(chapter)}>
                        ✏️ Bearbeiten
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDeleteChapter(chapter.id)}>
                        🗑️ Löschen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subchapters Tab */}
      {activeTab === 'subchapters' && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              📖 Schritt 1: Kapitel auswählen
            </label>
            <select
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-blue-500"
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSubchapterForm({ ...subchapterForm, chapterId: e.target.value });
                // Find and set the combination of the selected chapter
                const chapter = allChapters.find(c => c.id === e.target.value);
                if (chapter) {
                  const source = chapter.sourceLanguage || 'de';
                  const target = chapter.targetLanguage || chapter.language;
                  setFilterCombination(`${source}|${target}`);
                }
              }}
            >
              <option value="">-- Bitte Kapitel wählen --</option>
              {allChapters.map((chapter) => {
                const source = chapter.sourceLanguage || 'de';
                const target = chapter.targetLanguage || chapter.language;
                return (
                  <option key={chapter.id} value={chapter.id}>
                    #{chapter.order} - {chapter.title} ({getLanguageFlag(source)} → {getLanguageFlag(target)} {source.toUpperCase()}-{target.toUpperCase()})
                  </option>
                );
              })}
            </select>
            {selectedChapterId && (
              <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                ℹ️ Sprachrichtung: {(() => { const ch = allChapters.find(c => c.id === selectedChapterId); return ch ? `${getLanguageName(ch.sourceLanguage || 'de')} → ${getLanguageName(ch.targetLanguage || ch.language)}` : ''; })()}
              </p>
            )}
          </div>

          {selectedChapterId && (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {subchapterForm.id ? '✏️ Unterkapitel bearbeiten' : '➕ Neues Unterkapitel erstellen'}
                </h3>
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
                  💡 Titel und Beschreibung in <strong>{getLanguageName(parseCombination(filterCombination)[0])}</strong> ({getLanguageFlag(parseCombination(filterCombination)[0])}) schreiben - der Ausgangssprache Ihrer Lernenden
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[0])} Titel des Unterkapitels*
                    </label>
                    <input
                      type="text"
                      placeholder={parseCombination(filterCombination)[0] === 'de' ? 'z.B. Alltagsgrüße' : parseCombination(filterCombination)[0] === 'en' ? 'e.g. Daily Greetings' : 'p.ex. Cumprimentos diários'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={subchapterForm.title}
                      onChange={(e) => setSubchapterForm({ ...subchapterForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reihenfolge (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="z.B. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={subchapterForm.order}
                      onChange={(e) => setSubchapterForm({ ...subchapterForm, order: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[0])} Beschreibung (optional)
                    </label>
                    <textarea
                      placeholder={parseCombination(filterCombination)[0] === 'de' ? 'z.B. Lerne Grüße für den Alltag' : parseCombination(filterCombination)[0] === 'en' ? 'e.g. Learn everyday greetings' : 'p.ex. Aprenda cumprimentos do dia a dia'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={subchapterForm.description}
                      onChange={(e) => setSubchapterForm({ ...subchapterForm, description: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📍 Position (Einfügen nach Unterkapitel)
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={subchapterForm.insertAfterSubchapterId}
                        onChange={(e) => setSubchapterForm({ ...subchapterForm, insertAfterSubchapterId: e.target.value })}
                      >
                        <option value="">-- Am Anfang einfügen --</option>
                        {subchapters.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            #{sc.order} - {sc.title}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Neues Unterkapitel hinter diesem einfügen</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🔒 Verfügbarkeit
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={subchapterForm.isLocked ? 'locked' : 'unlocked'}
                        onChange={(e) => setSubchapterForm({ ...subchapterForm, isLocked: e.target.value === 'locked' })}
                      >
                        <option value="unlocked">✅ Verfügbar</option>
                        <option value="locked">🔒 Bald verfügbar (gesperrt)</option>
                      </select>
                    </div>
                  </div>

                  {subchapterForm.isLocked && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        📅 Automatische Freischaltung (optional)
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={subchapterForm.unlocksAt}
                        onChange={(e) => setSubchapterForm({ ...subchapterForm, unlocksAt: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Wählen Sie ein Datum, um das Unterkapitel automatisch freizuschalten. Lassen Sie dieses Feld leer für manuelle Freischaltung.</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveSubchapter} isLoading={isSaving}>
                    {subchapterForm.id ? '💾 Aktualisieren' : '✨ Erstellen'}
                  </Button>
                  {subchapterForm.id && (
                    <Button variant="secondary" onClick={resetSubchapterForm}>
                      ❌ Abbrechen
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  📑 Vorhandene Unterkapitel
                </h3>
                {isLoading ? (
                  <p className="text-gray-600">⏳ Lädt...</p>
                ) : subchapters.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">📭 Keine Unterkapitel vorhanden</p>
                    <p className="text-sm text-gray-500 mt-1">Erstellen Sie Ihr erstes Unterkapitel</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subchapters.map((subchapter) => (
                      <div
                        key={subchapter.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-green-600">#{subchapter.order}</span>
                            <p className="font-semibold text-gray-900">{subchapter.title}</p>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span>📝 {subchapter.vocabulary?.length || 0} Vokabeln</span>
                          </p>
                          {subchapter.description && (
                            <p className="text-sm text-gray-500 mt-1 italic">"{subchapter.description}"</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="secondary" onClick={() => handleEditSubchapter(subchapter)}>
                            ✏️ Bearbeiten
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleDeleteSubchapter(subchapter.id)}>
                            🗑️ Löschen
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Vocabulary Tab */}
      {activeTab === 'vocabulary' && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              📖 Schritt 1: Kapitel auswählen
            </label>
            <select
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mb-4 font-medium focus:ring-2 focus:ring-blue-500"
              value={selectedChapterId}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
                setSelectedSubchapterId('');
                // Find and set the combination of the selected chapter
                const chapter = allChapters.find(c => c.id === e.target.value);
                if (chapter) {
                  const source = chapter.sourceLanguage || 'de';
                  const target = chapter.targetLanguage || chapter.language;
                  setFilterCombination(`${source}|${target}`);
                }
              }}
            >
              <option value="">-- Bitte Kapitel wählen --</option>
              {allChapters.map((chapter) => {
                const source = chapter.sourceLanguage || 'de';
                const target = chapter.targetLanguage || chapter.language;
                return (
                  <option key={chapter.id} value={chapter.id}>
                    #{chapter.order} - {chapter.title} ({getLanguageFlag(source)} → {getLanguageFlag(target)} {source.toUpperCase()}-{target.toUpperCase()})
                  </option>
                );
              })}
            </select>

            {selectedChapterId && (
              <>
                <label className="block text-sm font-semibold text-gray-900 mb-2 mt-4">
                  📑 Schritt 2: Unterkapitel auswählen
                </label>
                <select
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-blue-500"
                  value={selectedSubchapterId}
                  onChange={(e) => {
                    setSelectedSubchapterId(e.target.value);
                    setVocabularyForm({ ...vocabularyForm, subchapterId: e.target.value });
                  }}
                >
                  <option value="">-- Bitte Unterkapitel wählen --</option>
                  {subchapters.map((subchapter) => (
                    <option key={subchapter.id} value={subchapter.id}>
                      #{subchapter.order} - {subchapter.title}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {selectedSubchapterId && (
            <>
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <p className="text-base font-bold text-green-900">
                      Übersetzungsrichtung: {getLanguageName(parseCombination(filterCombination)[1])} → {getLanguageName(parseCombination(filterCombination)[0])}
                    </p>
                    <p className="text-sm text-green-700">
                      Vokabel in <strong>{getLanguageName(parseCombination(filterCombination)[1])}</strong> eingeben, 
                      Übersetzung auf <strong>{getLanguageName(parseCombination(filterCombination)[0])}</strong>
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-green-300">
                  <p className="text-xs text-gray-700">
                    💡 <strong>Beispiel:</strong> {filterCombination === 'de|en' ? 'Wort: "Hello", Übersetzung: "Hallo"' : filterCombination === 'de|pt-br' ? 'Wort: "Olá", Übersetzung: "Hallo"' : 'Vokabel in Zielsprache, Übersetzung in Ausgangssprache'}
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {vocabularyForm.id ? '✏️ Vokabel bearbeiten' : '➕ Neue Vokabel erstellen'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[1])} Wort in {getLanguageName(parseCombination(filterCombination)[1])}*
                    </label>
                    <input
                      type="text"
                      placeholder={filterCombination === 'de|en' ? 'e.g. House' : filterCombination === 'de|pt-br' ? 'p.ex. Casa' : 'Wort in Zielsprache'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={vocabularyForm.word}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, word: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[0])} Übersetzung in {getLanguageName(parseCombination(filterCombination)[0])}*
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Haus"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={vocabularyForm.translation}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, translation: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reihenfolge (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="z.B. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={vocabularyForm.order}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, order: e.target.value })}
                    />
                  </div>
                  <div></div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[1])} Beispielsatz in {getLanguageName(parseCombination(filterCombination)[1])} (optional)
                    </label>
                    <textarea
                      placeholder={filterCombination === 'de|en' ? 'e.g. This is my house.' : filterCombination === 'de|pt-br' ? 'p.ex. Esta é a minha casa.' : 'Beispielsatz in Zielsprache'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={vocabularyForm.example}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, example: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {getLanguageFlag(parseCombination(filterCombination)[0])} Übersetzter Beispielsatz in {getLanguageName(parseCombination(filterCombination)[0])} (optional)
                    </label>
                    <textarea
                      placeholder={filterCombination === 'de|en' ? 'z.B. Das ist mein Haus.' : 'Übersetzung in Ausgangssprache'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={vocabularyForm.translatedExample}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, translatedExample: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveVocabulary} isLoading={isSaving}>
                    {vocabularyForm.id ? '💾 Aktualisieren' : '✨ Erstellen'}
                  </Button>
                  {vocabularyForm.id && (
                    <Button variant="secondary" onClick={resetVocabularyForm}>
                      ❌ Abbrechen
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  📚 Vorhandene Vokabeln
                </h3>
                {isLoading ? (
                  <p className="text-gray-600">⏳ Lädt...</p>
                ) : vocabulary.length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">📭 Keine Vokabeln vorhanden</p>
                    <p className="text-sm text-gray-500 mt-1">Erstellen Sie Ihre erste Vokabel</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vocabulary.map((vocab) => (
                      <div
                        key={vocab.id}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-gradient-to-r from-white to-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-bold text-purple-600">#{vocab.order}</span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                                  {getLanguageFlag(parseCombination(filterCombination)[1])} {vocab.word}
                                </span>
                                <span className="text-gray-400 text-xl">→</span>
                                <span className="text-lg font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                                  🇩🇪 {vocab.translation}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              🌍 {getLanguageName(parseCombination(filterCombination)[1])} → Deutsch
                            </p>
                            {vocab.example && (
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-sm text-blue-900">
                                  <span className="font-semibold">{getLanguageFlag(parseCombination(filterCombination)[1])} Beispiel:</span> {vocab.example}
                                </p>
                                {vocab.translatedExample && (
                                  <p className="text-sm text-green-900 mt-1">
                                    <span className="font-semibold">🇩🇪 Übersetzung:</span> {vocab.translatedExample}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleEditVocabulary(vocab)}>
                              ✏️
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleDeleteVocabulary(vocab.id)}>
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
