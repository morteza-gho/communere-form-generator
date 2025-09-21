import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Checkbox, FormControlLabel, IconButton, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";

import { v4 as uuidv4 } from 'uuid';
import type { Choice, Element } from '../types/general';
import { parseInput } from "../utils/parseInput";

interface Props {
  elements: Element[]
  setElements: React.Dispatch<React.SetStateAction<Element[]>>
}

const FormEditorFields = ({ elements, setElements }: Props) => {

  const updateElement = (id: string, patch: Partial<Element>) =>
    setElements((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const addChoice = (elId: string) => {
    const newChoice: Choice = { id: uuidv4(), name: 'Option' };
    updateElement(elId, { choices: [...(elements.find((e) => e.id === elId)?.choices || []), newChoice] });
  };

  const removeElement = (id: string) => setElements((s) => s.filter((e) => e.id !== id));

  return (
    elements.map((el) => (
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
              size='small'
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
                size='small'
                onChange={(e) => updateElement(el.id, { conditions: [{ ...el.conditions![0], valueToMatch: parseInput(e.target.value) }] })}
                placeholder='Use true or the field name'
              />
            )}
          </Box>
        </Box>
      </Paper>
    ))
  )
}
export default FormEditorFields;


