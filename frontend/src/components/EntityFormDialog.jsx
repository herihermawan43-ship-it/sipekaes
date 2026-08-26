import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from './ui/select';

/**
 * Generic form dialog. `fields` is an array of
 *   { name, label, type: 'text'|'select', options?: [{value,label}], required?, placeholder? }
 */
const EntityFormDialog = ({ open, onOpenChange, title, description, fields, initialData, onSubmit }) => {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setData(initialData || {});
  }, [initialData, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit(data);
    setSaving(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name} className={f.full ? 'col-span-2' : ''}>
              <Label className="font-semibold text-sm mb-1.5 block">{f.label}{f.required && <span className="text-red-500"> *</span>}</Label>
              {f.type === 'select' ? (
                <Select value={data[f.name] || ''} onValueChange={(v) => setData({...data, [f.name]: v})}>
                  <SelectTrigger className="h-10"><SelectValue placeholder={f.placeholder || `Pilih ${f.label}`} /></SelectTrigger>
                  <SelectContent>
                    {f.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={data[f.name] || ''}
                  onChange={(e) => setData({...data, [f.name]: e.target.value})}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="h-10"
                />
              )}
            </div>
          ))}
          <DialogFooter className="col-span-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-bold">Batal</Button>
            <Button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 font-bold">{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EntityFormDialog;
