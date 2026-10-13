import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomInt } from 'node:crypto'
import test from 'node:test'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

test('participants finish in order and results stay private until completion', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'price-of-nothing-'))
  const port = randomInt(33000, 50000)
  const base = `http://127.0.0.1:${port}`
  let server
  let output = ''

  const startServer = async () => {
    server = spawn(process.execPath, ['.output/server/index.mjs'], {
      env: { ...process.env, NITRO_HOST: '127.0.0.1', PORT: String(port), EXPERIMENT_DB_PATH: join(directory, 'test.sqlite') },
      stdio: ['ignore', 'pipe', 'pipe']
    })
    server.stdout.on('data', (chunk) => { output += chunk })
    server.stderr.on('data', (chunk) => { output += chunk })
    for (let attempt = 0; attempt < 60; attempt++) {
      if (server.exitCode !== null) throw new Error(`Server exited: ${output}`)
      try {
        const response = await fetch(`${base}/api/session`)
        if (response.ok) return
      } catch { /* Wait for the server to listen. */ }
      await sleep(100)
    }
    throw new Error(`Server did not start: ${output}`)
  }

  const stopServer = async () => {
    if (!server || server.exitCode !== null) return
    server.kill('SIGTERM')
    await new Promise((resolve) => server.once('exit', resolve))
  }

  const request = async (path, { method = 'GET', body, cookie } = {}) => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        ...(cookie ? { cookie } : {}),
        ...(body ? { 'content-type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual'
    })
    const contentType = response.headers.get('content-type') || ''
    return {
      status: response.status,
      location: response.headers.get('location'),
      cookie: response.headers.get('set-cookie')?.split(';')[0],
      data: contentType.includes('application/json') ? await response.json() : await response.text()
    }
  }

  const finish = async (cookie, note, reason = 'branding') => {
    const seenImages = []
    for (let stepIndex = 0; stepIndex < 6; stepIndex++) {
      const current = await request('/api/session', { cookie })
      assert.equal(current.data.phase, 'pricing')
      assert.equal(current.data.stepIndex, stepIndex)
      seenImages.push(current.data.presentation.image)
      const estimate = await request('/api/estimates', { method: 'POST', cookie, body: { stepIndex, euros: 10 + stepIndex } })
      assert.equal(estimate.status, 200)
      const replay = await request('/api/estimates', { method: 'POST', cookie, body: { stepIndex, euros: 10 + stepIndex } })
      assert.equal(replay.status, 200)
      assert.equal(replay.data.phase, estimate.data.phase)
    }
    assert.deepEqual([seenImages[0], seenImages[2], seenImages[4]], [seenImages[1], seenImages[3], seenImages[5]])
    const reveal = await request('/api/reveal', { cookie })
    assert.equal(reveal.status, 200)
    assert.equal(reveal.data.length, 3)
    assert.equal((await request('/api/results', { cookie })).status, 403)
    assert.equal((await request('/api/feedback', { method: 'POST', cookie, body: { reason, explanation: note } })).status, 403)
    assert.equal((await request('/api/reveal/continue', { method: 'POST', cookie })).data.phase, 'feedback')
    assert.equal((await request('/api/feedback', { method: 'POST', cookie, body: { reason, explanation: 'x'.repeat(201) } })).status, 400)
    assert.equal((await request('/api/feedback', { method: 'POST', cookie, body: { reason, explanation: note } })).data.phase, 'completed')
    assert.equal((await request('/api/feedback', { method: 'POST', cookie, body: { reason, explanation: note } })).data.phase, 'completed')
  }

  try {
    await startServer()
    assert.equal((await request('/api/session')).data.phase, 'welcome')
    assert.equal((await request('/api/results')).status, 401)
    assert.equal((await request('/api/reveal')).status, 401)
    const blockedPage = await request('/results')
    assert.equal(blockedPage.status, 302)
    assert.equal(blockedPage.location, '/')

    const first = await request('/api/session', { method: 'POST' })
    const firstCookie = first.cookie
    assert.ok(firstCookie)
    assert.equal(first.data.phase, 'pricing')
    assert.equal((await request('/api/results', { cookie: firstCookie })).status, 403)
    assert.equal((await request('/api/reveal', { cookie: firstCookie })).status, 403)
    assert.equal((await request('/api/estimates', { method: 'POST', cookie: firstCookie, body: { stepIndex: 0, euros: -1 } })).status, 400)
    await finish(firstCookie, 'The name made a difference.')

    const firstResults = await request('/api/results', { cookie: firstCookie })
    assert.equal(firstResults.status, 200)
    assert.equal(firstResults.data.completedCount, 1)
    assert.equal(firstResults.data.explanations.length, 0)
    assert.equal(firstResults.data.reasons.find((value) => value.key === 'branding').count, 1)
    assert.equal((await request('/results', { cookie: firstCookie })).status, 200)

    const second = await request('/api/session', { method: 'POST' })
    const secondCookie = second.cookie
    assert.ok(secondCookie)
    await finish(secondCookie, '<script>alert(1)</script>', 'photography')
    const updated = await request('/api/results', { cookie: firstCookie })
    assert.equal(updated.data.participantCount, 2)
    assert.equal(updated.data.completedCount, 2)
    assert.equal(updated.data.explanations.length, 1)
    assert.equal(updated.data.explanations[0].text, '<script>alert(1)</script>')
    assert.equal((await request('/api/results', { cookie: secondCookie })).data.explanations[0].text, 'The name made a difference.')

    const restarted = await request('/api/session', { method: 'POST', cookie: firstCookie, body: { restart: true } })
    assert.equal(restarted.data.phase, 'pricing')
    assert.equal((await request('/api/results', { cookie: restarted.cookie })).status, 403)
    await stopServer()
    await startServer()
    assert.equal((await request('/api/results', { cookie: firstCookie })).data.completedCount, 2)
    assert.equal((await request('/api/session', { cookie: restarted.cookie })).data.stepIndex, 0)
  } finally {
    await stopServer()
    await rm(directory, { recursive: true, force: true })
  }
})
