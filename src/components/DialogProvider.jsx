import React, { createContext, useContext, useState, useCallback } from 'react';
import './DialogProvider.css';

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export default function DialogProvider({ children }) {
  const [dialogs, setDialogs] = useState([]);

  const showDialog = useCallback((config) => {
    return new Promise((resolve) => {
      const id = Date.now().toString();
      
      const closeDialog = () => {
        setDialogs((prev) => prev.filter((d) => d.id !== id));
      };

      const handleConfirm = (data) => {
        closeDialog();
        resolve(data === undefined ? true : data);
      };

      const handleCancel = () => {
        closeDialog();
        resolve(null);
      };

      setDialogs((prev) => [
        ...prev,
        {
          id,
          config,
          handleConfirm,
          handleCancel,
        },
      ]);
    });
  }, []);

  const alert = useCallback(
    (message, title = 'Alert') => {
      return showDialog({ type: 'alert', message, title });
    },
    [showDialog]
  );

  const confirm = useCallback(
    (message, title = 'Confirm') => {
      return showDialog({ type: 'confirm', message, title });
    },
    [showDialog]
  );

  const customForm = useCallback(
    (config) => {
      return showDialog({ type: 'custom', ...config });
    },
    [showDialog]
  );

  return (
    <DialogContext.Provider value={{ alert, confirm, customForm }}>
      {children}
      {dialogs.map((dialog) => (
        <DialogRenderer key={dialog.id} dialog={dialog} />
      ))}
    </DialogContext.Provider>
  );
}

function DialogRenderer({ dialog }) {
  const { config, handleConfirm, handleCancel } = dialog;
  const { type, title, message, fields, submitText = 'OK', cancelText = 'Cancel', danger = false } = config;

  const [formData, setFormData] = useState(() => {
    const initial = {};
    if (fields) {
      fields.forEach((f) => {
        initial[f.name] = f.defaultValue || '';
      });
    }
    return initial;
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (type === 'custom') {
      handleConfirm(formData);
    } else {
      handleConfirm(true);
    }
  };

  return (
    <div className="indocx-dialog-overlay" onClick={handleCancel}>
      <div className="indocx-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="indocx-dialog-header">
          <img src="/logo.png" alt="Company Logo" className="indocx-dialog-logo" />
          <h3 className="indocx-dialog-title">{title}</h3>
        </div>
        <form onSubmit={onSubmit}>
          <div className="indocx-dialog-content">
            {message && <p>{message}</p>}
            
            {type === 'custom' && fields && (
              <div className="indocx-dialog-form">
                {fields.map((field) => {
                  if (field.condition && !field.condition(formData)) {
                    return null;
                  }

                  return (
                    <div className="indocx-dialog-form-group" key={field.name}>
                      <label htmlFor={field.name}>{field.label} {field.required && '*'}</label>
                      
                      {field.type === 'select' ? (
                        <select
                          id={field.name}
                          required={field.required}
                          value={formData[field.name]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                          <option value="" disabled>Select {field.label}</option>
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          required={field.required}
                          rows={3}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                      ) : (
                        <input
                          id={field.name}
                          type={field.type || 'text'}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="indocx-dialog-footer">
            {type !== 'alert' && (
              <button type="button" className="indocx-dialog-btn indocx-dialog-btn-cancel" onClick={handleCancel}>
                {cancelText}
              </button>
            )}
            <button
              type="submit"
              className={`indocx-dialog-btn ${danger ? 'indocx-dialog-btn-danger' : 'indocx-dialog-btn-submit'}`}
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
