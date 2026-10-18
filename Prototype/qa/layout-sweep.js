// Inspection only: renders existing route DOM snapshots without changing application state.
export async function inspectRouteLayouts() {
  const screens = [...document.querySelectorAll('.screen[data-screen]')];
  const active = screens.find((screen) => !screen.hidden);
  const savedScroll = scrollY;
  const rows = [];
  for (const screen of screens) {
    screens.forEach((entry) => { entry.hidden = entry !== screen; });
    scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const visible = (el) => !el.closest('[hidden]') && el.getClientRects().length;
    const images = [...screen.querySelectorAll('img')].filter(visible);
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
    const controls = [...screen.querySelectorAll('input:not([type=file]), textarea, select, button')].filter(visible);
    scrollTo(0, document.documentElement.scrollHeight);
    const navTop = document.querySelector('.bottom-nav').getBoundingClientRect().top;
    const finalControl = controls.at(-1);
    rows.push({ screen: screen.dataset.screen, width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
      images: images.map((img) => ({src:img.getAttribute('src'), natural:[img.naturalWidth,img.naturalHeight], visible:[Math.round(img.width),Math.round(img.height)]})),
      clippedControls: controls.filter((el) => {const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth + 1;}).map((el)=>el.id || el.name || el.textContent.trim().slice(0,45)),
      finalActionAboveNav: finalControl ? finalControl.getBoundingClientRect().bottom <= navTop : null,
    });
  }
  screens.forEach((screen) => { screen.hidden = screen !== active; });
  scrollTo(0, savedScroll);
  const previous = JSON.parse(sessionStorage.getItem('qa-layouts') || '[]').filter((row) => row.width !== innerWidth);
  sessionStorage.setItem('qa-layouts', JSON.stringify([...previous,...rows]));
  return { width:innerWidth, screens:rows.length, failures:rows.filter((row)=>row.overflow||row.clippedControls.length||row.finalActionAboveNav===false) };
}
