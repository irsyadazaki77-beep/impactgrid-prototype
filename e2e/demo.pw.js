import { expect, test } from '@playwright/test';

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

test('runs the complete seven-minute executive pitch with official script and responsive presenter controls', async ({ page }) => {
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
  await expect(page.locator('[data-theme="light"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Demo lokal' })).toBeVisible();
  await page.keyboard.press('e');
  await expect(page.getByText('14:00 WIB').last()).toBeVisible();
  await page.keyboard.press('e');

  await page.setViewportSize({ width: 1920, height: 1080 });
  const titles = [
    'Masalah: konteks energi dan emisi',
    'Solusi: keputusan lintas fungsi yang lebih baik',
    'Simulasi: empat langkah usulan',
    'Validasi: audit dahulu, pilot bersyarat',
    'Finansial: sensitivitas, bukan janji hasil',
    'ESG: ukur sebelum mengklaim',
    'Keputusan: setujui audit kebutuhan terlebih dahulu',
  ];
  const stageDurations = [60, 60, 90, 60, 75, 45, 30];
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

test('runs the copilot locally without making a network request', async ({ page }) => {
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
});

test('retains a usable layout at desktop, tablet, and mobile widths', async ({ page }) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, `document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, `body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
  }
  await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click();
  await expect(page.locator('[data-theme="dark"]')).toBeVisible();
  await page.getByRole('button', { name: 'Aktifkan mode terang' }).click();
  await expect(page.locator('[data-theme="light"]')).toBeVisible();
});

test('shows local demo fallback when browser goes offline', async ({ page, context }) => {
  await context.setOffline(true);
  await expect(page.getByRole('status').first()).toContainText('OFFLINE');
  await expect(page.locator('main .tab-panel:not([hidden]) h1').first()).toBeVisible();
  await page.getByRole('button', { name: /Buka Peta Interaktif/ }).click();
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
