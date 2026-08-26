import { useState, useEffect, useCallback } from 'react';
import { toast } from '../hooks/use-toast';

export function useEntity(api, entityLabel = 'Data') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.list();
      setItems(res.data);
    } catch (e) {
      toast({ title: `Gagal memuat ${entityLabel}`, description: e.response?.data?.detail || e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [api, entityLabel]);

  useEffect(() => { load(); }, [load]);

  const create = async (data) => {
    try {
      await api.create(data);
      toast({ title: `${entityLabel} berhasil ditambahkan` });
      await load();
      return true;
    } catch (e) {
      toast({ title: 'Gagal menambah', description: e.response?.data?.detail || e.message, variant: 'destructive' });
      return false;
    }
  };

  const update = async (id, data) => {
    try {
      await api.update(id, data);
      toast({ title: `${entityLabel} berhasil diperbarui` });
      await load();
      return true;
    } catch (e) {
      toast({ title: 'Gagal memperbarui', description: e.response?.data?.detail || e.message, variant: 'destructive' });
      return false;
    }
  };

  const remove = async (id) => {
    try {
      await api.remove(id);
      toast({ title: `${entityLabel} berhasil dihapus` });
      await load();
      return true;
    } catch (e) {
      toast({ title: 'Gagal menghapus', description: e.response?.data?.detail || e.message, variant: 'destructive' });
      return false;
    }
  };

  return { items, loading, load, create, update, remove };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { statsApi } = await import('../lib/api');
        const res = await statsApi.summary();
        setStats(res.data);
      } catch (e) { console.error(e); }
    })();
  }, []);
  return stats;
}
