import { z as zod } from 'zod';
import { SurveySchema } from '../SurveySchema';

const SelectSurveyParser = zod.array(SurveySchema);

export { SelectSurveyParser };
