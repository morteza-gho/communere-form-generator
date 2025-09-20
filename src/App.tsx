import React from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { FormEditor } from './components/FormEditor';
import { FormRenderer } from './components/FormRenderer';
import { useFormsStore } from './stores/formsStore';

export const App: React.FC = () => {
  const forms = useFormsStore((s) => s.forms);
  const getFormById = useFormsStore((s) => s.getFormById);

  // for demo: render first form (if any)
  const demoForm = forms.length > 0 ? getFormById(forms[0].id) : undefined;

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormEditor />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {demoForm && (
          <Box id="renderer" sx={{ marginTop: 10, position: 'sticky', top: 30 }} >
            <FormRenderer form={demoForm} onSubmit={(v) => alert(JSON.stringify(v, null, 2))} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
export default App