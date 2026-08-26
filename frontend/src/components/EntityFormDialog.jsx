import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from './ui/select';

/**
 * Fields:
 *  { name, label, type: 'text'|'select'|'checkbox'|'section', options?, required?, placeholder?, full?, showIf?: {fieldName: value} }
 */
const EntityFormDialog = ({ open, onOpenChange, title, description, fields, initialData, onSubmit }) => {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);

  React.useEffect(() => { setData(initialData || {}); }, [initialData, open]);

  const isFieldVisible = (f) => {
    if (!f.showIf) return true;
    return Object.entries(f.showIf).every(([key, val]) => data[key] === val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit(data);
    setSaving(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {fields.map((f, idx) => {
            if (!isFieldVisible(f)) return null;

            if (f.type === 'section') {
              return (
                <div key={idx} className="col-span-2 pt-3 pb-1 border-t border-gray-100 mt-2 first:border-t-0 first:mt-0 first:pt-0">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-orange-600">{f.label}</p>
                  {f.description && <p className="text-xs text-gray-500 font-medium mt-0.5">{f.description}</p>}
                </div>
              );
            }

            if (f.type === 'checkbox') {
              return (
                <div key={f.name} className={`col-span-2 flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100`}>
                  <Checkbox
                    id={f.name}
                    checked={!!data[f.name]}
                    onCheckedChange={(v) => setData({ ...data, [f.name]: !!v })}
                  />
                  <label htmlFor={f.name} className="text-sm font-bold cursor-pointer flex-1">{f.label}
                    {f.hint && <span className="block text-xs font-medium text-gray-500 mt-0.5">{f.hint}</span>}
                  </label>
                </div>
              );
            }

            return (
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
            );
          })}
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
