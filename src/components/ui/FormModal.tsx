import { useState } from 'react';
import { Modal } from '@/components/ui/overlays';
import { useToast } from '@/components/ui/toast';

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'tel' | 'number' | 'date';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}

export function AddFormModal({
  open,
  onClose,
  title,
  description,
  fields,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
}) {
  const { push } = useToast();
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !data[f.key]) {
        newErrors[f.key] = 'هذا الحقل مطلوب';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(data);
    setData({});
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => { setData({}); setErrors({}); onClose(); }}
      title={title}
      description={description}
      size="md"
      footer={
        <>
          <button className="btn-ghost" onClick={() => { setData({}); setErrors({}); onClose(); }}>إلغاء</button>
          <button className="btn-primary" onClick={handleSubmit}>حفظ</button>
        </>
      }
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              {field.label}
              {field.required && <span className="text-danger mr-1">*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                className="input"
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
              >
                <option value="">{field.placeholder || 'اختر...'}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                className="input"
                placeholder={field.placeholder}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                dir={field.type === 'tel' || field.type === 'number' ? 'ltr' : 'rtl'}
              />
            )}
            {errors[field.key] && (
              <p className="text-xs text-danger mt-1">{errors[field.key]}</p>
            )}
            {field.hint && !errors[field.key] && (
              <p className="text-xs text-ink-400 mt-1">{field.hint}</p>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
