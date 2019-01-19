/**
 * This file is built and pushed to Google Scripts using the source code and tools at https://github.com/Gapminder/gsheets-gm-functions
 */

import { GM_AGGREGATE } from "./GM_AGGREGATE";
import { GM_ID } from "./GM_ID";
import { GM_INTERPOLATE } from "./GM_INTERPOLATE";
import { GM_NAME } from "./GM_NAME";
import { GM_PROP } from "./GM_PROP";

// Expose as custom functions
(global as any).GM_AGGREGATE = GM_AGGREGATE;
(global as any).GM_ID = GM_ID;
(global as any).GM_INTERPOLATE = GM_INTERPOLATE;
(global as any).GM_NAME = GM_NAME;
(global as any).GM_PROP = GM_PROP;
