import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormsStore } from '../stores/formsStore';
import type { Element, Form } from '../types/general';
import FormEditorFields from './FormEditorFields';

export const FormEditor: React.FC = () => {
  const { forms, createForm, updateForm, deleteForm, selectedFormId, setSelectedFormId } = useFormsStore();
  const [name, setName] = useState('');
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    const currentForm = forms.find((x) => x.id === selectedFormId)!;
    if (currentForm) {
      setName(currentForm.name);
      setElements(currentForm.elements); // show the selected form on refresh page
    }
  }, [])

  const selectForm = (id: string | null) => {
    setSelectedFormId(id); // store selected form

    if (!id) {
      setName('');
      setElements([]);
      return;
    }

    const f = forms.find((x) => x.id === id)!;
    setName(f.name);
    setElements(f.elements);
  };

  const handleDeleteForm = () => {
    if (!selectedFormId) return;
    const formName = forms.find((x) => x.id === selectedFormId)?.name;
    if (confirm(`Are you sure to delte "${formName}"?`)) {
      deleteForm(selectedFormId);
      // reset editor to "new form"
      setSelectedFormId(null);
      setName('');
      setElements([]);

    }
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
      <Typography variant="h4" sx={{ mt: 3 }}>Dynamic Form Builder</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
          <TextField label="Form name" size='medium' value={name} onChange={(e) => setName(e.target.value)} />
          <Button variant="contained" size='large' onClick={save}>
            {selectedFormId ? 'Save' : 'Create'}
          </Button>
          {selectedFormId && (
            <Button variant="outlined" size='large' color="error" onClick={handleDeleteForm}>
              <DeleteIcon />
              Delete
            </Button>
          )}
        </Box>

        {selectedFormId &&
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button onClick={() => addElement('text')} startIcon={<AddIcon />}>Add Text Field</Button>
            <Button onClick={() => addElement('checkbox')} startIcon={<AddIcon />}>Add Checkbox</Button>
          </Box>
        }

        <FormEditorFields elements={elements} setElements={setElements} />

      </Paper>
    </Container>
  );
};

