import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { Plus, Search } from 'lucide-react';

export default function KnowledgeBaseView() {
  const { state, addKnowledgeBase } = useOfflineStorage();
  const { currentUser } = useLocalAuth();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
  });

  const handleAddKB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    addKnowledgeBase({
      id: `kb_${Date.now()}`,
      title: formData.title,
      category: formData.category,
      content: formData.content,
      tags: formData.tags.split(',').map(t => t.trim()),
      createdBy: currentUser.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setFormData({ title: '', category: '', content: '', tags: '' });
    setShowForm(false);
  };

  const filteredKB = state.knowledgeBase.filter(kb =>
    kb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kb.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Base de Conhecimento</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <form onSubmit={handleAddKB} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do artigo"
                required
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Hardware, Software"
                  required
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="tag1, tag2, tag3"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Conteúdo</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Escreva o conteúdo do artigo..."
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Publicar
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="bg-slate-700 border-slate-600"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar artigos..."
          className="bg-slate-800 border-slate-700 pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredKB.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-6 text-center">
            <p className="text-slate-400">Nenhum artigo encontrado</p>
          </Card>
        ) : (
          filteredKB.map((kb) => (
            <Card key={kb.id} className="bg-slate-800 border-slate-700 p-6">
              <div className="mb-3">
                <h4 className="text-lg font-semibold text-white mb-1">{kb.title}</h4>
                <p className="text-sm text-slate-400">{kb.category}</p>
              </div>

              <p className="text-slate-300 mb-4 line-clamp-3">{kb.content}</p>

              {kb.tags && kb.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {kb.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
