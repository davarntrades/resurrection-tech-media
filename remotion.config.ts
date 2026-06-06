import {Config} from '@remotion/cli/config';

// Rendering defaults. The visual look of every composition lives in `src/` —
// this file only governs how the CLI encodes the output.
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(null);
