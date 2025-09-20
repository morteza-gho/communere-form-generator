// src/components/FormEditor/FormEditor.tsx
import React, { useState } from 'react';
import type { Form, Element, Choice } from '../types/general';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFormsStore } from '../stores/formsStore';

export const FormEditor: React.FC = () => {
  const { forms, createForm, updateForm } = useFormsStore();
  const [name, setName] = useState('');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [elements, setElements] = useState<Element[]>([]);

  const selectForm = (id: string | null) => {
    setSelectedFormId(id);
    if (!id) {
      setName('');
      setElements([]);
      return;
    }
    const f = forms.find((x) => x.id === id)!;
    setName(f.name);
    setElements(f.elements);
  };

  const addElement = (type: Element['type']) => {
    const newEl: Element = {
      id: uuidv4(),
      type,
      label: `${type} field`,
      isRequired: false
    };
    setElements((s) => [...s, newEl]);
  };

  const updateElement = (id: string, patch: Partial<Element>) =>
    setElements((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const addChoice = (elId: string) => {
    const newChoice: Choice = { id: uuidv4(), name: 'Option' };
    updateElement(elId, { choices: [...(elements.find((e) => e.id === elId)?.choices || []), newChoice] });
  };

  const removeElement = (id: string) => setElements((s) => s.filter((e) => e.id !== id));

  const save = () => {
    const form: Form = {
      id: selectedFormId || uuidv4(),
      name,
      elements
    };
    if (selectedFormId) updateForm(form);
    else createForm(form);
    // reset after save to give immediate feedback
    setSelectedFormId(form.id);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 3 }}>Form Editor</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Form name" value={name} onChange={(e) => setName(e.target.value)} />
          <Select
            value={selectedFormId ?? ''}
            onChange={(e) => selectForm(e.target.value === '' ? null : (e.target.value as string))}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">Create new...</MenuItem>
            {forms.map((f) => (
              <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={save}>Save</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button onClick={() => addElement('text')} startIcon={<AddIcon />}>Add Text</Button>
          <Button onClick={() => addElement('checkbox')} startIcon={<AddIcon />}>Add Checkbox</Button>
        </Box>

        {elements.map((el) => (
          <Paper sx={{ p: 2, mb: 1 }} key={el.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>{el.type} — {el.label}</Typography>
              <IconButton onClick={() => removeElement(el.id)}><DeleteIcon /></IconButton>
            </Box>

            <TextField
              label="Label"
              value={el.label}
              onChange={(e) => updateElement(el.id, { label: e.target.value })}
              fullWidth
              sx={{ mt: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!!el.isRequired}
                  onChange={(e) => updateElement(el.id, { isRequired: e.target.checked })}
                />
              }
              label="Required"
              sx={{ mt: 1 }}
            />

            {el.type === 'checkbox' && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Choices (optional)</Typography>
                {(el.choices || []).map((c) => (
                  <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <TextField
                      value={c.name}
                      onChange={(ev) => {
                        const newName = ev.target.value;
                        updateElement(el.id, {
                          choices: (el.choices || []).map((ch) => (ch.id === c.id ? { ...ch, name: newName } : ch))
                        });
                      }}
                    />
                    <IconButton onClick={() => {
                      updateElement(el.id, { choices: (el.choices || []).filter((x) => x.id !== c.id) });
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button sx={{ mt: 1 }} onClick={() => addChoice(el.id)}>Add choice</Button>
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Conditions (show only when...)</Typography>
              <Typography variant="caption" color="text.secondary">
                Choose a target element and the value that must match. Element will be shown only when all conditions match.
              </Typography>

              {/* For simplicity allow only one condition here (you can expand to multiple) */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Select
                  displayEmpty
                  value={el.conditions?.[0]?.targetElementId ?? ''}
                  onChange={(e) => {
                    const target = e.target.value as string;
                    if (!target) {
                      updateElement(el.id, { conditions: undefined });
                    } else {
                      updateElement(el.id, { conditions: [{ targetElementId: target, valueToMatch: '' }] });
                    }
                  }}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value=""><em>No condition</em></MenuItem>
                  {elements.filter((x) => x.id !== el.id).map((other) => (
                    <MenuItem key={other.id} value={other.id}>{other.label}</MenuItem>
                  ))}
                </Select>

                {el.conditions?.[0] && (
                  <TextField
                    label="Value to match"
                    value={String(el.conditions[0].valueToMatch ?? '')}
                    onChange={(e) => updateElement(el.id, { conditions: [{ ...el.conditions![0], valueToMatch: parseInput(e.target.value) }] })}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        ))}

      </Paper>
    </Container>
  );
};

// helper: naive parse value to boolean/number/string
function parseInput(v: string) {
  if (v === 'true') return true;
  if (v === 'false') return false;
  const n = Number(v);
  if (!Number.isNaN(n) && v.trim() !== '') return n;
  return v;
}
