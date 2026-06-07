import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

/**
 * Blocks a frame's capture until the embedded Geist fonts are ready — but with a
 * hard 5s cap so a degraded or recycled Chrome render tab can never stall the
 * render on an uncleared delayRender(). The fonts are base64 data URIs, so on a
 * healthy tab this resolves in well under a second.
 *
 * Call once near the top of a composition (see ExplainerTemplate).
 */
export const useFontsReady = (): void => {
  const [handle] = useState(() => delayRender('Loading brand fonts'));

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      continueRender(handle);
    };

    // Hard cap — guarantees the handle clears far inside the render timeout.
    const cap = setTimeout(finish, 5000);

    Promise.all([
      document.fonts.load("400 1em 'Geist'"),
      document.fonts.load("600 1em 'Geist'"),
      document.fonts.load("italic 600 1em 'Geist'"),
      document.fonts.load("500 1em 'Geist Mono'"),
    ])
      .then(() => document.fonts.ready)
      .then(finish)
      .catch(finish);

    return () => clearTimeout(cap);
  }, [handle]);
};
