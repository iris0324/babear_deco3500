// Local browser QA helper. Never imported by the production application.
const visible = (el) => el && !el.closest('[hidden]') && el.getClientRects().length;
const tick = () => new Promise((resolve) => setTimeout(resolve, 80));
export const qa = {
  results: [], errors: [],
  async click(selector) {
    const el = [...document.querySelectorAll(selector)].find(visible);
    if (!el || el.disabled) throw new Error(`Unavailable action: ${selector}`);
    el.click(); await tick(); return this.record(selector);
  },
  async submit(selector, values = {}, submitter) {
    const form = document.querySelector(selector);
    for (const [key, value] of Object.entries(values)) { const input = form.elements.namedItem(key); if (!input) throw new Error(`Missing ${key}`); input.value = value; }
    if (!form.checkValidity()) throw new Error(`Invalid form: ${selector}`);
    form.requestSubmit(submitter ? form.querySelector(submitter) : undefined); await tick(); return this.record(selector);
  },
  record(action) {
    const screen = document.querySelector('.screen:not([hidden])');
    const images = [...screen.querySelectorAll('img')].filter(visible);
    const result = { screen: screen.dataset.screen, width: innerWidth, action, overflow: document.documentElement.scrollWidth > innerWidth, broken: images.filter((img) => img.currentSrc && img.complete && !img.naturalWidth).length };
    this.results.push(result); sessionStorage.setItem('qa-results', JSON.stringify(this.results)); return result;
  },
  async upload(selector, full = false) {
    const canvas = document.createElement('canvas'); canvas.width = full ? 200 : 100; canvas.height = 100;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#7b4025'; ctx.fillRect(0,0,100,100); if (full) { ctx.fillStyle = '#436f55'; ctx.fillRect(100,0,100,100); }
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));
    const files = new DataTransfer(); files.items.add(new File([blob], `qa-${full ? 'full' : 'fragment'}.png`, {type:'image/png'}));
    const input = document.querySelector(selector); input.files = files.files; input.dispatchEvent(new Event('change', {bubbles:true}));
    await new Promise((resolve) => setTimeout(resolve, 200)); return this.record(`file upload ${selector}`);
  },
};
window.addEventListener('error', (event) => { qa.errors.push(event.message); sessionStorage.setItem('qa-errors',JSON.stringify(qa.errors)); });
window.addEventListener('unhandledrejection', (event) => { qa.errors.push(String(event.reason)); sessionStorage.setItem('qa-errors',JSON.stringify(qa.errors)); });
window.qa = qa;
