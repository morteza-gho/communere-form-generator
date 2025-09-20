import React from 'react';

import { Box, Grid } from '@mui/material';
import { FormEditor } from './components/FormEditor';
import { FormRenderer } from './components/FormRenderer';
import { useFormsStore } from './stores/formsStore';

export const App: React.FC = () => {
  const { forms, selectedFormId, getFormById } = useFormsStore();

  const currentForm = selectedFormId ? getFormById(selectedFormId)
    : forms.length > 0 ? getFormById(forms[0].id)
      : undefined;

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormEditor />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {currentForm && (
          <Box id="renderer" sx={{ marginTop: 10, position: 'sticky', top: 30 }} >
            <FormRenderer form={currentForm} onSubmit={(v) => alert(JSON.stringify(v, null, 2))} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default App