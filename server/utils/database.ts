import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import type { Phase, ReasonKey } from '../../shared/types/experiment'

export interface SubmissionRow {
  id: string
  token_hash: string
  created_at: string
  completed_at: string | null
  phase: Exclude<Phase, 'welcome'>
  step_index: number
  shirt_premium_first: number
  mug_premium_first: number
  tote_premium_first: number
  shirt_ordinary: number | null
  shirt_premium: number | null
  mug_ordinary: number | null
  mug_premium: number | null
  tote_ordinary: number | null
  tote_premium: number | null
  reason: ReasonKey | null
  explanation: string | null
}

let database: DatabaseSync | undefined

export function getDatabase(): DatabaseSync {
  if (database) return database

  const path = resolve(process.env.EXPERIMENT_DB_PATH || 'data/experiment.sqlite')
  mkdirSync(dirname(path), { recursive: true })
  database = new DatabaseSync(path, { timeout: 5000 })
  database.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')
  database.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      phase TEXT NOT NULL CHECK (phase IN ('pricing', 'reveal', 'feedback', 'completed')),
      step_index INTEGER NOT NULL CHECK (step_index BETWEEN 0 AND 6),
      shirt_premium_first INTEGER NOT NULL CHECK (shirt_premium_first IN (0, 1)),
      mug_premium_first INTEGER NOT NULL CHECK (mug_premium_first IN (0, 1)),
      tote_premium_first INTEGER NOT NULL CHECK (tote_premium_first IN (0, 1)),
      shirt_ordinary INTEGER CHECK (shirt_ordinary BETWEEN 0 AND 2000),
      shirt_premium INTEGER CHECK (shirt_premium BETWEEN 0 AND 2000),
      mug_ordinary INTEGER CHECK (mug_ordinary BETWEEN 0 AND 2000),
      mug_premium INTEGER CHECK (mug_premium BETWEEN 0 AND 2000),
      tote_ordinary INTEGER CHECK (tote_ordinary BETWEEN 0 AND 2000),
      tote_premium INTEGER CHECK (tote_premium BETWEEN 0 AND 2000),
      reason TEXT,
      explanation TEXT
    ) STRICT;
    CREATE INDEX IF NOT EXISTS submissions_completed_at ON submissions(completed_at);
  `)
  return database
}

export function getSubmissionByHash(hash: string): SubmissionRow | undefined {
  return getDatabase().prepare('SELECT * FROM submissions WHERE token_hash = ?').get(hash) as SubmissionRow | undefined
}
