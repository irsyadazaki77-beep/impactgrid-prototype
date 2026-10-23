import { expect, test } from '@playwright/test';

async function confirmPresentationPreflight(page) {
  const dialog = page.getByRole('dialog', { name: 'Periksa kesiapan presentasi' });
  await expect(dialog).toBeVisible();
  const checks = dialog.getByRole('checkbox');
  await expect(checks.first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Batal' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(checks.first()).toBeFocused();
  for (let index = 0; index < await checks.count(); index += 1) await checks.nth(index).check();
  await dialog.getByRole('button', { name: 'Mulai pitch dan reset demo' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__impactGridPrintCalls = 0;
    window.__impactGridLcp = null;
    window.print = () => { window.__impactGridPrintCalls += 1; };
    new PerformanceObserver((entries) => {
      const last = entries.getEntries().at(-1);
      if (last) window.__impactGridLcp = last.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto('/');
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  await expect(page.locator('main .tab-panel:not([hidden]) .module-loading')).toHaveCount(0);
});

test('loads each module on demand and keeps module state during navigation', async ({ page }) => {
  await expect(page.locator('[data-theme="light"]')).toBeVisible();
  await expect(page.getByRole('status').first()).toContainText('DEMO LOKAL');
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  await expect(page.locator('main .tab-panel:not([hidden]) .module-loading')).toHaveCount(0);

  await page.getByRole('button', { name: /Buka Peta Interaktif/ }).click();
  await expect(page.locator('.leaflet-control-attribution')).toBeVisible();

  const tabLoadTimes = [];
  for (const name of ['Validasi Pilot', 'Simulasi Skenario', 'Dampak Finansial', 'Dampak ESG']) {
    const startedAt = Date.now();
    await page.getByRole('button', { name }).click();
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
    tabLoadTimes.push({ tab: name, clickToContentMs: Date.now() - startedAt });
  }

  await page.getByRole('button', { name: 'Deep Engineering' }).click();
  const modules = ['Digital Twin', 'Orkestrasi Agen', 'Telemetri', 'Optimasi', 'Arsitektur'];
  for (const name of modules) {
    const startedAt = Date.now();
    await page.getByRole('button', { name }).click();
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
    await expect(page.locator('main .tab-panel:not([hidden]) .module-loading')).toHaveCount(0);
    tabLoadTimes.push({ tab: name, clickToContentMs: Date.now() - startedAt });
  }

  await page.getByRole('button', { name: 'Simulasi Skenario' }).click();
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  await page.getByRole('button', { name: 'Deep Engineering' }).click();
  await page.getByRole('button', { name: 'Digital Twin' }).click();
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Digital Twin');

  await page.getByRole('button', { name: 'Executive Pitch' }).click();
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Rancangan DSS Efisiensi');
  const mapBounds = await page.locator('.leaflet-container').boundingBox();
  expect(mapBounds?.width).toBeGreaterThan(100);
  expect(mapBounds?.height).toBeGreaterThan(100);
  await expect(page.locator('main .tab-panel[hidden]')).toHaveCount(9);
  console.log(`Tab navigation timings: ${JSON.stringify(tabLoadTimes)}`);
});

test('ignores shortcuts in modals and fields, prints memo, and resets the demo', async ({ page }) => {
  await page.getByRole('button', { name: 'Dampak Finansial' }).click();
  await page.keyboard.press('p');
  await expect(page.getByRole('heading', { name: 'Memo konsep ImpactGrid' })).toBeVisible();
  await page.keyboard.press('1');
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Model sensitivitas');

  await page.getByRole('button', { name: 'Cetak / PDF' }).click();
  await expect.poll(() => page.evaluate(() => window.__impactGridPrintCalls)).toBe(1);
  await page.getByRole('button', { name: 'Tutup', exact: true }).click();

  await page.getByRole('button', { name: /Executive & Defense Toolkit/ }).click();
  await page.getByRole('button', { name: /Lihat Lembar Kerja Asumsi/ }).click();
  await expect(page.getByRole('heading', { name: 'Rencana validasi data dan sensitivitas awal' })).toBeVisible();
  await page.getByRole('button', { name: 'Cetak / PDF' }).click();
  await expect.poll(() => page.evaluate(() => window.__impactGridPrintCalls)).toBe(2);
  await page.locator('.fixed.inset-0').last().getByRole('button', { name: 'Tutup' }).last().click();

  await page.keyboard.press('e');
  const input = page.locator('input').first();
  await input.focus();
  await page.keyboard.press('5');
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Model sensitivitas');
  await page.getByRole('button', { name: 'Tutup konsol simulasi' }).click();

  await page.getByRole('button', { name: /Start Presentation 7 menit/ }).click();
  await expect(page.getByRole('dialog', { name: 'Periksa kesiapan presentasi' })).toBeVisible();
  await page.keyboard.press('1');
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Model sensitivitas');
  await confirmPresentationPreflight(page);
  await expect(page.getByRole('heading', { name: 'Masalah: konteks energi dan emisi' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Solusi: keputusan lintas fungsi yang lebih baik' })).toBeVisible();

  await page.keyboard.press('e');
  await page.getByRole('button', { name: 'Putar jam demo' }).click();
  await page.keyboard.press('1');
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Rancangan DSS Efisiensi');
  await expect(page.getByText('15:00 WIB').first()).toBeVisible({ timeout: 3500 });
  await page.getByRole('button', { name: 'Reset seluruh simulasi' }).click();
  await expect(page.locator('main .tab-panel:not([hidden])')).toContainText('Rancangan DSS Efisiensi');
  await expect(page.getByRole('button', { name: 'Deep Engineering' })).toBeVisible();
  await expect(page.locator('main .tab-panel[hidden]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Start Presentation 7 menit/ })).toBeVisible();
  await page.keyboard.press('e');
  await expect(page.getByText('14:00 WIB').last()).toBeVisible();
});

test('opens and closes the presentation, emergency, defense, and copilot dialogs', async ({ page }) => {
  for (const [shortcut, expectedText] of [
    ['t', 'Mode Presentasi Eksekutif'],
    ['s', 'Pemilihan skenario keselamatan'],
    ['q', '8 Pertanyaan Kritis Direksi'],
    ['a', 'ImpactGrid AI Reasoning Copilot'],
  ]) {
    await page.keyboard.press(shortcut);
    await expect(page.locator('.fixed.inset-0').last()).toBeVisible();
    await expect(page.locator('.fixed.inset-0').last()).toContainText(expectedText);
    await page.locator('.fixed.inset-0').last().locator('button').first().click();
  }
});

test('changes emergency and normal scenario states without claiming a real network test', async ({ page }) => {
  await page.keyboard.press('s');
  const modal = page.locator('.fixed.inset-0').last();
  await expect(modal).toContainText('TIDAK ADA SKENARIO YANG DIPILIH');
  await modal.getByRole('button', { name: 'Pilih skenario lonjakan (demo)' }).click();
  await expect(modal).toContainText('SKENARIO KESELAMATAN DIPILIH UNTUK DEMO');
  await expect(modal).toContainText('Layanan darurat 112');
  await expect(modal).toContainText('Belum diuji');
  await modal.getByRole('button', { name: 'Reset Normal' }).click();
  await expect(modal).toContainText('TIDAK ADA SKENARIO YANG DIPILIH');
  await modal.locator('button').first().click();
});

test('runs the complete seven-minute executive pitch through all eight script stages', async ({ page }) => {
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.clock.install();
  await page.reload();
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();

  await page.keyboard.press('e');
  await page.getByRole('button', { name: /Biaya energi/ }).click();
  await page.getByRole('button', { name: 'Putar jam demo' }).click();
  await page.clock.runFor(1000);
  await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click();
  await expect(page.locator('[data-theme="dark"]')).toBeVisible();
  await page.getByRole('button', { name: 'Start Presentation 7 menit' }).click();
  await confirmPresentationPreflight(page);
  await expect(page.locator('[data-theme="light"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Demo lokal' })).toBeVisible();
  await page.keyboard.press('e');
  await expect(page.getByText('14:00 WIB').last()).toBeVisible();
  await page.keyboard.press('e');

  await page.setViewportSize({ width: 1920, height: 1080 });
  const titles = [
    'Masalah: konteks energi dan emisi',
    'Solusi: keputusan lintas fungsi yang lebih baik',
    'Simulasi: rekonsiliasi dan bandingkan skenario',
    'Simulasi: prioritisasi dan bukti keputusan',
    'Validasi: audit dahulu, pilot bersyarat',
    'Finansial: sensitivitas, bukan janji hasil',
    'ESG: ukur sebelum mengklaim',
    'Keputusan: setujui audit kebutuhan terlebih dahulu',
  ];
  const stageDurations = [60, 60, 45, 45, 60, 75, 45, 30];
  await expect(page.getByRole('timer')).toContainText('7:00');
  await page.getByRole('button', { name: 'Buka presenter notes dan sumber' }).click();
  await expect(page.getByText(/Telkomsel memiliki skala layanan nasional/)).toBeVisible();
  await expect(page.getByText(/Laporan Keberlanjutan Telkom 2025; Profil GoZero/)).toBeVisible();
  await page.getByRole('button', { name: 'Sembunyikan presenter notes' }).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: titles[1] })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('heading', { name: titles[0] })).toBeVisible();
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: titles[1] })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await page.getByRole('button', { name: 'Jeda timer' }).click();
  const pausedTimer = await page.locator('.presentation-time-main').innerText();
  await page.clock.runFor(5000);
  await expect(page.locator('.presentation-time-main')).toHaveText(pausedTimer);
  await page.getByRole('button', { name: 'Lanjutkan timer' }).click();

  await page.getByRole('button', { name: 'Layar penuh' }).click();
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true);
  await page.keyboard.press('f');
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.locator('.presentation-dock')).toHaveCount(0);
  await page.keyboard.press('w');
  await confirmPresentationPreflight(page);
  await expect(page.getByRole('heading', { name: titles[0] })).toBeVisible();
  await expect(page.getByRole('timer')).toContainText('7:00');

  for (let index = 0; index < titles.length; index += 1) {
    await expect(page.getByRole('heading', { name: titles[index] })).toBeVisible();
    await page.clock.runFor(stageDurations[index] * 1000);
    if (index < titles.length - 1) {
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('heading', { name: titles[index + 1] })).toBeVisible();
    }
  }
  await expect(page.getByRole('timer')).toContainText(/0:00|\+/);
  await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '420');
  const projectorDock = await page.locator('.presentation-dock').boundingBox();
  expect(projectorDock?.width).toBe(1920);
  expect(projectorDock?.y).toBeGreaterThan(500);
  const projectorTextSize = await page.locator('.presentation-message > p').evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(projectorTextSize).toBeGreaterThanOrEqual(19);

  await page.keyboard.press('e');
  await page.getByRole('button', { name: /Trafik/ }).last().click();
  await expect(page.getByRole('button', { name: 'Asumsi trafik' })).toBeVisible();
  await page.getByRole('button', { name: 'Ulangi presentasi dari awal' }).click();
  await expect(page.getByRole('button', { name: 'Demo lokal' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Buka presenter notes dan sumber' }).click();
  await expect(page.getByText(/Telkomsel memiliki skala layanan nasional/)).toBeVisible();
  const width = await page.evaluate(() => ({ viewport: innerWidth, doc: document.documentElement.scrollWidth }));
  expect(width.doc).toBeLessThanOrEqual(width.viewport);
  await expect(page.getByRole('heading', { name: titles[0] })).toBeVisible();
  await expect(page.getByRole('timer')).toContainText('7:00');
  expect(runtimeErrors).toEqual([]);
});

test('keeps the copilot local by default and falls back when the AI proxy fails', async ({ page }) => {
  const externalRequests = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/ai/chat') || request.url().includes('generativelanguage.googleapis.com')) {
      externalRequests.push(request.url());
    }
  });

  await page.keyboard.press('a');
  const composer = page.getByPlaceholder('Tanyakan tentang rancangan, asumsi, atau data yang perlu divalidasi...');
  await composer.fill('Apa itu ImpactGrid?');
  await composer.press('Enter');
  await expect(page.locator('.fixed.inset-0').last()).toContainText('Rancangan ImpactGrid', { timeout: 5000 });
  expect(externalRequests).toEqual([]);

  await page.locator('.fixed.inset-0').last().getByTitle('Pengaturan koneksi AI server').click();
  await page.getByRole('checkbox', { name: 'Gunakan model AI melalui backend (opsional)' }).check();
  await page.route('**/api/ai/chat', (route) => route.abort('failed'));
  await composer.fill('Apakah ImpactGrid menjamin SLA?');
  await composer.press('Enter');
  await expect(page.locator('.fixed.inset-0').last()).toContainText('Keselamatan jaringan dan layanan darurat', { timeout: 5000 });
  expect(externalRequests).toHaveLength(1);
});

test('retains a usable layout at desktop, tablet, and mobile widths', async ({ page }) => {
  const viewports = [
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];
  const modules = [
    { key: 'v', title: 'Validasi Pilot' }, { key: '5', title: 'Simulasi Skenario' },
    { key: '8', title: 'Dampak Finansial' }, { key: '7', title: 'Dampak ESG' },
  ];
  const engineeringModules = [
    { key: '2', title: 'Digital Twin' }, { key: '3', title: 'Orkestrasi Agen' },
    { key: '4', title: 'Telemetri' }, { key: '6', title: 'Optimasi' }, { key: '9', title: 'Arsitektur' },
  ];
  for (const { width, height } of viewports) {
    await page.setViewportSize({ width, height });
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
    for (const { key, title } of modules) {
      await page.keyboard.press(key);
      await expect(page.locator('main .tab-panel:not([hidden]) h1').first(), `${title} at ${width}px`).toBeVisible();
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      expect(dimensions.document, `${title} document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, `${title} body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    }
    await page.getByRole('button', { name: 'Deep Engineering' }).click();
    for (const { key, title } of engineeringModules) {
      await page.keyboard.press(key);
      await expect(page.locator('main .tab-panel:not([hidden]) h1').first(), `${title} at ${width}px`).toBeVisible();
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      expect(dimensions.document, `${title} document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, `${title} body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    }
    await page.getByRole('button', { name: 'Executive Pitch' }).click();
  }
  await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click();
  await expect(page.locator('[data-theme="dark"]')).toBeVisible();
  await page.getByRole('button', { name: 'Aktifkan mode terang' }).click();
  await expect(page.locator('[data-theme="light"]')).toBeVisible();
});

test('renders every module in light and dark themes without horizontal overflow', async ({ page }) => {
  const executiveModules = ['Ringkasan', 'Validasi Pilot', 'Simulasi Skenario', 'Dampak Finansial', 'Dampak ESG'];
  const engineeringModules = ['Digital Twin', 'Orkestrasi Agen', 'Telemetri', 'Optimasi', 'Arsitektur'];
  for (const theme of ['light', 'dark']) {
    const currentTheme = await page.locator('.impactgrid-app').getAttribute('data-theme');
    if (currentTheme !== theme) await page.getByRole('button', { name: theme === 'dark' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang' }).click();
    for (const name of executiveModules) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
      if (theme === 'dark' && name === 'Dampak ESG') {
        const contrast = await page.locator('main .tab-panel:not([hidden]) section').first().evaluate((section) => {
          const luminance = (color) => {
            const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
              const channel = value / 255;
              return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
            });
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
          };
          const background = getComputedStyle(section).backgroundColor;
          const foreground = getComputedStyle(section.querySelector('h1')).color;
          const values = [luminance(background), luminance(foreground)].sort((a, b) => b - a);
          return (values[0] + 0.05) / (values[1] + 0.05);
        });
        expect(contrast, 'ESG hero text contrast in dark theme').toBeGreaterThanOrEqual(4.5);
      }
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, body: document.body.scrollWidth, viewport: innerWidth }));
      expect(Math.max(widths.doc, widths.body), `${theme} theme overflow in ${name}`).toBeLessThanOrEqual(widths.viewport);
    }
    await page.getByRole('button', { name: 'Deep Engineering' }).click();
    for (const name of engineeringModules) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, body: document.body.scrollWidth, viewport: innerWidth }));
      expect(Math.max(widths.doc, widths.body), `${theme} theme overflow in ${name}`).toBeLessThanOrEqual(widths.viewport);
    }
    await page.getByRole('button', { name: 'Executive Pitch' }).click();
  }
  expect(await page.locator('.app-error-card').count()).toBe(0);
});

test('captures visual audit evidence for Light and Dark at presentation viewports', async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  const viewports = [
    { width: 1366, height: 768, name: 'desktop-1366x768' },
    { width: 1920, height: 1080, name: 'projector-1920x1080' },
    { width: 768, height: 1024, name: 'tablet-768x1024' },
    { width: 390, height: 844, name: 'mobile-390x844' },
  ];
  for (const theme of ['light', 'dark']) {
    const currentTheme = await page.locator('.impactgrid-app').getAttribute('data-theme');
    if (currentTheme !== theme) await page.getByRole('button', { name: theme === 'dark' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang' }).click();
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const module of ['Ringkasan', 'Dampak ESG']) {
        if (viewport.width < 768) await page.getByRole('button', { name: 'Buka navigasi' }).click();
        await page.getByRole('button', { name: module, exact: true }).click();
        await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
        const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
        expect(Math.max(dimensions.document, dimensions.body), `${theme} ${module} overflow at ${viewport.width}px`).toBeLessThanOrEqual(dimensions.viewport);
        const screenshotName = `${theme}-${viewport.name}-${module === 'Ringkasan' ? 'dashboard' : 'esg'}`;
        const screenshotPath = testInfo.outputPath(`${screenshotName}.png`);
        await page.screenshot({ path: screenshotPath, animations: 'disabled' });
        await testInfo.attach(screenshotName, { path: screenshotPath, contentType: 'image/png' });
      }
    }
    if (theme === 'light') {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.getByRole('button', { name: 'Start Presentation 7 menit' }).click();
      const dialog = page.getByRole('dialog', { name: 'Periksa kesiapan presentasi' });
      const checks = dialog.getByRole('checkbox');
      for (let index = 0; index < await checks.count(); index += 1) await checks.nth(index).check();
      await dialog.getByRole('button', { name: 'Mulai pitch dan reset demo' }).click();
      await page.waitForTimeout(300);
      const screenshotPath = testInfo.outputPath('light-desktop-guided-pitch.png');
      await page.screenshot({ path: screenshotPath, animations: 'disabled' });
      await testInfo.attach('light-desktop-guided-pitch', { path: screenshotPath, contentType: 'image/png' });
      await page.keyboard.press('Escape');
    }
  }
});

test('serves the production SPA after direct navigation and refresh and loads local assets', async ({ page, baseURL }) => {
  for (const path of ['/', '/presentation/refresh-check']) {
    const response = await page.goto(`${baseURL}${path}`);
    expect(response?.status(), `initial response for ${path}`).toBe(200);
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
    const refreshed = await page.reload();
    expect(refreshed?.status(), `refresh response for ${path}`).toBe(200);
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  }
  await page.getByRole('button', { name: 'Deep Engineering' }).click();
  await page.getByRole('button', { name: 'Arsitektur', exact: true }).click();
  const images = page.locator('main .tab-panel:not([hidden]) img');
  await expect(images.first()).toBeVisible();
  const brokenImages = await images.evaluateAll((items) => items.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc));
  expect(brokenImages).toEqual([]);
  const failedLocalAssets = [];
  page.on('response', (response) => {
    const request = response.request();
    if (response.url().startsWith(baseURL) && ['script', 'stylesheet', 'image'].includes(request.resourceType()) && !response.ok() && response.status() !== 304) {
      failedLocalAssets.push(response.url());
    }
  });
  await page.reload();
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  expect(failedLocalAssets).toEqual([]);
});

test('shows local demo fallback when browser goes offline', async ({ page, context }) => {
  await page.route('**/?impactgrid-connectivity=*', (route) => route.abort('failed'));
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(page.getByRole('status').first()).toContainText('HOST DEMO TIDAK TERJANGKAU');
  await page.unroute('**/?impactgrid-connectivity=*');
  await page.route('https://*.tile.openstreetmap.org/**', (route) => route.abort('failed'));
  await page.getByRole('button', { name: /Buka Peta Interaktif/ }).click();
  await expect(page.getByText('Peta dasar belum berhasil dimuat.')).toBeVisible({ timeout: 10_000 });
  await context.setOffline(true);
  await expect(page.getByRole('status').first()).toContainText('OFFLINE');
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  await expect(page.getByText('Peta tidak tersedia saat offline')).toBeVisible();
  await context.setOffline(false);
  await expect(page.getByRole('status').first()).toContainText('DEMO LOKAL');
});

test('records cold-load bundle and browser paint metrics', async ({ page }) => {
  await page.waitForLoadState('load');
  await page.waitForTimeout(300);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const scripts = performance.getEntriesByType('resource').filter((entry) => entry.name.endsWith('.js'));
    return {
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadEventMs: Math.round(navigation.loadEventEnd),
      largestContentfulPaintMs: window.__impactGridLcp == null ? null : Math.round(window.__impactGridLcp),
      initialJsTransferredBytes: scripts.reduce((sum, entry) => sum + entry.transferSize, 0),
      initialJsEncodedBytes: scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
      initialJsDecodedBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
      initialJsResourceCount: scripts.length,
      initialJsResources: scripts.map((entry) => ({ name: entry.name.split('/').at(-1), encodedBytes: entry.encodedBodySize, decodedBytes: entry.decodedBodySize })),
    };
  });
  console.log(`Cold browser metrics: ${JSON.stringify(metrics)}`);
  expect(metrics.domContentLoadedMs).toBeGreaterThan(0);
  expect(metrics.initialJsTransferredBytes).toBeGreaterThan(0);
});
