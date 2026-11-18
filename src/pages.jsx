import { Link, useParams } from 'react-router-dom'
import { players, byId, batters, bowlers, link, confLabel } from './data.js'

const NA = <span className="na">Not Available</span>
const val = (v) => (v === null || v === undefined || v === '' ? NA : v)
const PL = ({ name }) => { const id = link(name); return id ? <Link to={`/player/${id}`} className="plink">{name}</Link> : <>{name}</> }
const Flag = ({ k, children }) => <div className={`flag ${k}`}><strong>{{ sample: 'Small sample', verify: 'Needs Verification', phase: 'Phase / scope note' }[k]}:</strong> {children}</div>
const Pool = ({ p }) => <span className={`badge ${p === 'Overseas' ? 'blue' : 'pink'}`}>{p}</span>
const Page = ({ title, lead, children }) => <main className="page"><h1>{title}</h1>{lead && <p className="lead">{lead}</p>}{children}</main>

function Rank({ title, list }) {
  return (
    <section className="card" aria-labelledby={title}>
      <h2 id={title}>{title}</h2>
      <div className="scroll"><table className="rank">
        <thead><tr><th>Rank</th><th>Player</th><th>Nationality</th><th>Role / archetype</th></tr></thead>
        <tbody>{list.map((p) => (
          <tr key={p.id}><td className="rk">#{p.rank}</td>
            <td><Link to={`/player/${p.id}`} className="plink">{p.name}</Link> <Pool p={p.pool} /></td>
            <td>{p.nat}</td><td>{p.role}</td></tr>))}</tbody>
      </table></div>
    </section>
  )
}

export function Home() {
  return (
    <Page title="Final Player Recommendations" lead="The locked Top 10 Batters and Top 10 Bowlers for Rajasthan Royals. Click a player's name to open the full evidence profile.">
      <div className="callout">
        <strong>How to read these rankings</strong>
        <ul>
          <li>Rank = <b>strategic recruitment priority for RR</b>, not raw Supermodel V3 score order.</li>
          <li>Indian and overseas players are <b>integrated</b>, not grouped by nationality or category.</li>
          <li>All-rounders can appear in both lists where both disciplines matter; the current 20 slots are 20 distinct players.</li>
        </ul>
        <details><summary>The 7 ranking pillars</summary>
          <ol><li>Overall player quality</li><li>Importance to RR&rsquo;s squad requirements</li><li>Role scarcity and coverage</li><li>Expected squad impact</li><li>Versatility</li><li>Available performance evidence</li><li>Risk and reliability</li></ol>
        </details>
      </div>
      <div className="grid2"><Rank title="Top 10 Batters" list={batters} /><Rank title="Top 10 Bowlers" list={bowlers} /></div>
    </Page>
  )
}

const KV = ({ rows }) => <dl className="kv">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{val(v)}</dd></div>)}</dl>

export function Player() {
  const p = byId[useParams().id]
  if (!p) return <Page title="Player not found"><Link className="btn" to="/">Back to Recommendations</Link></Page>
  const rankLine = `#${p.rank} Top 10 ${p.list}s`
  return (
    <main className="page">
      <Link to="/" className="back">← Back to Recommendations</Link>
      <section className="card hero">
        <h1>{p.name}</h1>
        <div className="chips"><Pool p={p.pool} /><span className="badge">{p.nat}</span><span className="badge pink">{rankLine}</span><span className="badge">{confLabel[p.conf]}</span></div>
        <KV rows={[['Player ID', p.pid], ['Role / archetype', p.role], ['Batting style', p.bat], ['Bowling style', p.bowl], ['Typical batting position', p.pos], ['Typical bowling phase', p.phase], ['Wicketkeeping', p.wk]]} />
      </section>
      <section className="card"><h2>Recommendation summary</h2>
        <p><b>{rankLine.replace('Top 10 ', 'Top 10 ')}</b> — {p.thesis}</p>
        <p><b>RR requirement addressed:</b> {p.gap.join('; ')}</p>
      </section>
      <section className="card"><h2>Performance evidence</h2>
        {p.flags?.map((f, i) => <Flag key={i} k={f.k}>{f.t}</Flag>)}
        {p.ev.map((e, i) => (
          <div key={i} className="ev"><h3>{e.t}</h3><p className="muted small">Source: {e.src} · Sample: {e.n}{p.latest ? ` · Latest match: ${p.latest}` : ''}</p>
            <KV rows={e.rows} />
            {e.tbl && <div className="scroll"><table><thead><tr>{e.tbl.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{e.tbl.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{val(c)}</td>)}</tr>)}</tbody></table></div>}
          </div>))}
      </section>
      <section className="card"><h2>Model information</h2>
        {p.pool === 'Indian' ? (
          <p>Evaluated through the <b>Indian Domestic &amp; IPL Evidence Selection Methodology</b>. Supermodel V3 was not used for this player, so no V3 score, tier or rank is shown.</p>
        ) : (
          <>
            <p className="muted small">Supermodel V3 · model rank is separate from the strategic rank above.</p>
            <div className="scroll"><table><thead><tr><th>Discipline</th><th>Score</th><th>Adjusted</th><th>Model rank</th><th>Tier</th></tr></thead>
              <tbody>{p.model.map((m) => <tr key={m.d}><td>{m.d}</td><td>{m.score}</td><td>{val(m.adj)}</td><td>{m.rank}</td><td>{m.tier}</td></tr>)}</tbody></table></div>
            {p.model.some((m) => m.extra) && <KV rows={p.model.flatMap((m) => m.extra || [])} />}
          </>
        )}
      </section>
      <section className="card"><h2>Strategic reasoning, risks &amp; comparison</h2>
        <p><b>Why #{p.rank}:</b> {p.cmp}</p>
        <div className="grid2"><div><h3>Strengths</h3><ul>{p.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div><div><h3>Risks</h3><ul>{p.risks.map((s) => <li key={s}>{s}</li>)}</ul></div></div>
        <p className="muted small">Recommendations represent analytical recruitment priority, not a guarantee of auction acquisition or future match output.</p>
      </section>
    </main>
  )
}

const GAPS = [
  ['Top-order depth', 'Reliable Indian backups plus high-floor overseas cover', ['Ashwin Hebbar', 'Anmolpreet Singh', 'Liton Das']],
  ['Middle order & finishing', '#4/#5 stabiliser, LHB #5/#6 finisher (post-Hetmyer), lower-order hitting', ['Daryl Mitchell', 'Shamim Hossain', 'Mark Adair', 'Matthew Forde']],
  ['Wicketkeeping backup', 'Domestic WK-finishers; overseas cover behind Jurel and Pretorius', ['Luvnith Sisodia', 'Tejasvi Dahiya', 'Vansh Bedi', 'Liton Das']],
  ['Powerplay bowling', 'Indian powerplay strike pace; multi-phase overseas pace', ['Yudhvir Singh', 'Gerald Coetzee', 'Mark Adair']],
  ['Middle-over bowling', 'Middle-over Indian pace, hit-the-deck pace, Indian spin, LAO partner for Jadeja', ['Kuldeep Sen', 'Gerald Coetzee', 'Jhatavedh Subramanyan', 'Kumar Kartikeya Singh', 'George Linde']],
  ['Death bowling (overs 16–20)', 'Specialists so Archer and Burger can bowl earlier', ['Matheesha Pathirana', 'Akash Madhwal', 'Dushmantha Chameera', 'Gerald Coetzee', 'Kuldeep Sen']],
  ['All-rounders', 'Seam all-rounder after the Curran trade; spin all-rounder versatility', ['Aaron Hardie', 'Mark Adair', 'Matthew Forde', 'George Linde']],
]

export function RRAnalysis() {
  return (
    <Page title="RR Analysis" lead="Why Rajasthan Royals need the archetypes in the Top 10 lists.">
      <section className="card"><h2>A. Squad overview</h2>
        <p>Squad context referenced in the project brief (a full roster is <span className="na">Not Available</span> in the source documents):</p>
        <div className="scroll"><table><thead><tr><th>Player</th><th>Status / role in project context</th></tr></thead><tbody>
          <tr><td>Riyan Parag</td><td>Middle order</td></tr><tr><td>Dhruv Jurel</td><td>Middle order / wicketkeeper</td></tr>
          <tr><td>Lhuan-dre Pretorius</td><td>Wicketkeeping option</td></tr><tr><td>Ravindra Jadeja</td><td>Spin all-rounder</td></tr>
          <tr><td>Jofra Archer</td><td>Overseas — first-choice pace</td></tr><tr><td>Nandre Burger</td><td>Overseas — pace backup</td></tr>
          <tr><td>Donovan Ferreira</td><td>Overseas — middle order / finisher</td></tr><tr><td>Dasun Shanaka</td><td>Overseas — batting all-rounder</td></tr>
          <tr><td>Shimron Hetmyer</td><td>Released (left-handed #5/#6 finisher gap)</td></tr><tr><td>Sam Curran</td><td>Traded to LSG (seam all-rounder gap)</td></tr>
        </tbody></table></div></section>
      <section className="card"><h2>B. Squad strengths</h2>
        <ul><li>Middle order: Riyan Parag and Dhruv Jurel.</li><li>Spin all-rounder: Ravindra Jadeja.</li><li>First-choice pace: Jofra Archer.</li></ul></section>
      <section className="card"><h2>C &amp; D. Gaps and recruitment priorities</h2>
        <p className="muted small">RR will select a targeted subset, not all 20 players. Click a name to open the profile.</p>
        <div className="scroll"><table><thead><tr><th>Squad gap</th><th>Requirement</th><th>Candidates</th></tr></thead><tbody>
          {GAPS.map(([g, r, ps]) => <tr key={g}><td><b>{g}</b></td><td>{r}</td><td>{ps.map((n, i) => <span key={n}>{i > 0 && ', '}<PL name={n} /></span>)}</td></tr>)}
        </tbody></table></div></section>
      <section className="card"><h2>E. Overseas suggestions analysis</h2>
        <p>Existing overseas core: Archer (pace), Burger (pace backup), Ferreira (middle order / finisher), Shanaka (batting all-rounder). The ten overseas targets complement it:</p>
        <div className="scroll"><table><thead><tr><th>Target</th><th>List</th><th>How they complement</th></tr></thead><tbody>
          {players.filter((p) => p.pool === 'Overseas').sort((a, b) => a.list.localeCompare(b.list) || a.rank - b.rank).map((p) => <tr key={p.id}><td><PL name={p.name} /></td><td>{p.list} #{p.rank}</td><td>{p.thesis}</td></tr>)}
        </tbody></table></div></section>
      <section className="card"><h2>F. Domestic suggestions analysis</h2>
        <p>The ten Indian targets add depth across the gaps above, selected through the Indian domestic &amp; IPL evidence process (no Supermodel V3 scores).</p>
        <div className="scroll"><table><thead><tr><th>Target</th><th>List</th><th>Gap addressed</th><th>How they fit</th></tr></thead><tbody>
          {players.filter((p) => p.pool === 'Indian').sort((a, b) => a.list.localeCompare(b.list) || a.rank - b.rank).map((p) => <tr key={p.id}><td><PL name={p.name} /></td><td>{p.list} #{p.rank}</td><td>{p.gap.join('; ')}</td><td>{p.thesis}</td></tr>)}
        </tbody></table></div></section>
      <section className="card"><h2>G. Strategic conclusion</h2>
        <p>The pool is balanced: 10 Indian and 10 overseas, 10 batters and 10 bowlers. Highest-priority targets address death overs (Pathirana, Madhwal), the left-handed finisher gap (Hossain) and the seam all-rounder gap (Hardie, Adair, Forde), while the Indian cohort gives lower-cost depth and several auction pathways.</p></section>
    </Page>
  )
}

const DL = ({ href, name, size, who, notes }) => (
  <div className="dl"><div><h3>{name}</h3><p>{who}</p><p className="muted small">{size} · ZIP · packaged 18 Nov 2026</p><p className="muted small">{notes}</p></div>
    <a className="btn primary" href={href} download>Download</a></div>
)

export function Methodology() {
  return (
    <Page title="Model & Methodology" lead="Two separate workstreams: Indian domestic/IPL evidence selection, and Supermodel V3 for overseas players. There is no combined score.">
      <section className="card"><h2>Architecture</h2>
        <div className="grid2">
          <div><h3>Indian selection <Pool p="Indian" /></h3><p>Independent domestic and IPL evidence process. Supermodel V3 does <b>not</b> score, rank or validate any Indian player.</p></div>
          <div><h3>Overseas selection <Pool p="Overseas" /></h3><p>Supermodel V3 is the sole evaluation model for overseas candidates.</p></div>
        </div></section>
      <section className="card"><h2>Data sources &amp; candidate pool</h2>
        <ul><li><b>Indian:</b> domestic T20 leagues (DPL 2026, Maharaja Trophy 2026, APL 2026, Sher-e-Punjab 2026, TNPL 2026, SMAT); IPL career phase data (CricWall, AdvanceCricket); ESPNcricinfo / Google Sports aggregates; IPL 2027 Available Players pool.</li>
          <li><b>Overseas:</b> IPL and T20I data from 2022 onwards, scored by Supermodel V3.</li></ul>
        <h3>Indian funnel</h3>
        <div className="scroll"><table><thead><tr><th>Step</th><th>Players</th></tr></thead><tbody>
          <tr><td>1,184 domestic T20 squad listings (nine state leagues, since Jan 2025) + 795 IPL 2027 available players</td><td>1,184 + 795</td></tr>
          <tr><td>Overseas players and 184 retained/traded players removed; cross-matched to the Available Players sheet</td><td>127</td></tr>
          <tr><td>Role-based filters (top-order, keepers, pace, spin) on 2026 T20 and IPL stats</td><td>10</td></tr>
        </tbody></table></div>
        <p className="muted small">Candidates have different evidence sources and role requirements; they did not all pass identical thresholds. Five earlier candidates (Ajay Rohera, S. Habib Gandhi / Shakir Habib Gandhi, Kamil Shaik, K. Deeban Lingesh, Akhilesh Yadav) were excluded for dataset unavailability.</p></section>
      <section className="card"><h2>Supermodel V3 (overseas only)</h2>
        <p>A pressure-performance model: it scores every batter and bowler in the data on performance under pressure. Outputs include a 0–100 score, tier (A = full evidence, B = moderate, C = thin and shrunk toward average), phase levels (level_PP / MID / DEATH), and bootstrap rank intervals. Adjusted scores reflect sample-size penalties (Forde, Hardie, Linde).</p>
        <h3>Model rank vs strategic rank</h3>
        <p><PL name="Shamim Hossain" /> has batting model rank #9 (score 87.04) but is strategic #3 because of the left-handed #5/#6 gap. <PL name="Gerald Coetzee" /> has bowling model rank #44 / death rank #8 but is strategic #4 for multi-phase pace.</p></section>
      <section className="card"><h2>Sample sizes &amp; data quality</h2>
        <div className="scroll"><table><thead><tr><th>Player</th><th>Caveat</th></tr></thead><tbody>
          <tr><td><PL name="Aaron Hardie" /></td><td>8 bowling matches / 13 pressure overs</td></tr>
          <tr><td><PL name="George Linde" /></td><td>10 bowling matches / 20 pressure overs</td></tr>
          <tr><td><PL name="Matthew Forde" /></td><td>14 matches</td></tr>
          <tr><td><PL name="Vansh Bedi" /></td><td>10 innings / 100 balls (DPL Season 3)</td></tr>
          <tr><td><PL name="Yudhvir Singh" /></td><td>9 IPL matches / 23.0 overs; only 2.0 overs in 17–20</td></tr>
          <tr><td><PL name="Kuldeep Sen" /></td><td>12 IPL matches / 40.1 overs. <b>Needs Verification:</b> 255 tracked deliveries vs 241 balls</td></tr>
          <tr><td><PL name="Akash Madhwal" /></td><td>12.1 overs in 17–20 vs 25.4 overs in 15–20</td></tr>
          <tr><td><PL name="Kumar Kartikeya Singh" /></td><td>Domestic/SMAT records are separate from IPL records</td></tr>
          <tr><td>Hebbar, Anmolpreet, Sisodia, Dahiya, Subramanyan</td><td>Single-season domestic samples</td></tr>
        </tbody></table></div></section>
      <section className="card"><h2>Downloads</h2>
        <p>Judges can verify the methodology locally using the two packages below.</p>
        <DL href="./downloads/superr_model_v3.zip" name="Supermodel V3 package — overseas players" size="3.5 MB" who="Source code, README, methodology, validation outputs and rankings for the overseas workstream." notes="Contains no .env or API keys. No requirements file was found in the package." />
        <DL href="./downloads/Archive.zip" name="Indian target-pool package — Indian players" size="181 KB" who="Player-selection process document (PDF) and the domestic T20 player-pool workbook for the Indian workstream." notes="Includes a third-party-sourced workbook: confirm redistribution rights before public release." />
      </section>
    </Page>
  )
}
