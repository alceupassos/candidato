// Tweaks — Memorando de Investimento v2.0
// Acento (3 tons institucionais) + fonte display.

const MEMO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1F3A5F",
  "displayFont": "Newsreader"
}/*EDITMODE-END*/;

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

function MemoTweaksApp() {
  const [t, setTweak] = useTweaks(MEMO_TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', hexToRgba(t.accent, 0.08));
    root.setAttribute('data-display', t.displayFont === 'Instrument Serif' ? 'instrument' : 'newsreader');
  }, [t.accent, t.displayFont]);

  return (
    <TweaksPanel>
      <TweakSection label="Identidade" />
      <TweakColor
        label="Acento"
        value={t.accent}
        options={['#1F3A5F', '#5C4422', '#2E4B3C']}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakRadio
        label="Fonte display"
        value={t.displayFont}
        options={['Newsreader', 'Instrument Serif']}
        onChange={(v) => setTweak('displayFont', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<MemoTweaksApp />);
