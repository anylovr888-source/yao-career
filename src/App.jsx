import React, { useMemo, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, Instagram, BriefcaseBusiness, WalletCards } from 'lucide-react'
import { featureCards, routeResults, jobs } from './data'
import { trackEvent } from './lib/analytics'
import Soundscape from './components/Soundscape'

const todayKey=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei'}).format(new Date())

function Layout({children}) {
  return <>
    <header className="site-header">
      <Link to="/" className="brand">◇ 曜境 YAO</Link>
      <nav><a href="/#features">探索</a><a href="/#jobs">工作選擇</a><Link to="/report">今日報告</Link><Link to="/privacy">隱私</Link></nav>
      <a className="header-cta" href="https://www.instagram.com/xian._.185/" target="_blank">立即了解</a>
    </header>
    {children}
    <footer><div><b>曜境 YAO</b><span>人生沒有標準答案，但可以多一個選擇。</span></div><div><Link to="/privacy">隱私權</Link><Link to="/admin">Admin</Link><a href="https://www.instagram.com/xian._.185/" target="_blank">@xian._.185</a></div></footer>
    <Soundscape/>
  </>
}

function Home(){
  const nav=useNavigate()
  const hasRoute=localStorage.getItem('yao_route_date')===todayKey()
  return <Layout><main>
    <section className="hero">
      <div>
        <span className="eyebrow">YOUR NEXT CHOICE</span>
        <h1>人生沒有標準答案，<br/>但可以多一個選擇。</h1>
        <p>探索戀愛、工作、金錢與人生選擇。先玩一個，再看今天適合走哪條路。</p>
        <div className="hero-actions"><button className="primary" onClick={()=>nav('/fortune-slots')}>開始今天的探索 <ArrowRight size={18}/></button><a className="secondary" href="#jobs">看看工作選擇</a></div>
        {hasRoute && <button className="continue-route" onClick={()=>nav('/report')}>繼續我的今日路線 →</button>}
      </div>
      <div className="hero-orbit"><div className="orbit-center">YAO<small>今日訊號</small></div><div className="orb o1">LOVE</div><div className="orb o2">WORK</div><div className="orb o3">MONEY</div></div>
    </section>

    <section id="features" className="section">
      <div className="section-title"><span>今天想測什麼？</span><h2>先從一個你有感的問題開始</h2></div>
      <div className="feature-grid">{featureCards.map(([key,title,desc,icon])=><Link key={key} to={'/'+key} className="feature-card glass" onClick={()=>trackEvent('feature_card_click',{feature_key:key})}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p><span className="card-link">開始探索 →</span></Link>)}</div>
    </section>

    <section className="section report-preview">
      <div><span className="eyebrow">MY DAILY ROUTE</span><h2>我的今日報告</h2><p>你今天完成的測驗與互動，會整理成自己的今日路線圖。</p><Link className="primary link-btn" to="/report">查看今日報告</Link></div>
      <div className="report-card glass"><div className="progress-ring"><span>{hasRoute?'25':'0'}%</span></div><div><b>{hasRoute?'今天已經開始了':'今天還沒有探索紀錄'}</b><p>{hasRoute?'完成更多互動，報告會逐步更新。':'先從命運三連線或任一測驗開始。'}</p></div></div>
    </section>

    <section id="jobs" className="section">
      <div className="section-title"><span>找到適合自己的選擇</span><h2>工作不是只有一種答案</h2></div>
      <div className="job-tools"><Link to="/career-match" className="tool-card glass"><BriefcaseBusiness/><div><b>智能職缺配對</b><span>3 題快速找方向</span></div></Link><Link to="/salary" className="tool-card glass"><WalletCards/><div><b>薪資估算</b><span>快速估算工作收入</span></div></Link></div>
      <div className="jobs">{jobs.map(j=><JobCard key={j.title} job={j}/>)}</div>
    </section>

    <section className="section contact-section">
      <div><span className="eyebrow">CONTACT</span><h2>想多了解一點？</h2><p>可以先匿名探索，也可以留下聯絡方式，讓我們回覆你。</p></div>
      <ContactForm/>
    </section>
  </main></Layout>
}

function JobCard({job}){
  const [open,setOpen]=useState(false)
  return <div className="job-card glass"><div className="job-top"><div><h3>{job.title}</h3><b>{job.pay}</b></div><button className="icon-btn" onClick={()=>setOpen(v=>!v)}><ChevronDown/></button></div><div className="tags">{job.tags.map(t=><span key={t}>{t}</span>)}</div>{open&&<p>{job.desc}</p>}</div>
}

function ContactForm(){
  const [sent,setSent]=useState(false)
  return <form className="contact-form glass" onSubmit={e=>{e.preventDefault();setSent(true);trackEvent('form_submitted',{feature_key:'contact'})}}>
    <div className="two"><input required placeholder="暱稱 / 姓名"/><input required type="number" min="18" placeholder="年齡（18+）"/></div>
    <div className="two"><input placeholder="LINE ID"/><input placeholder="Instagram ID"/></div>
    <select defaultValue="Instagram"><option>Instagram</option><option>LINE</option><option>電話</option></select>
    <textarea placeholder="想了解的工作或想說的話"></textarea>
    <label className="check"><input required type="checkbox"/> 我已滿 18 歲，並同意隱私權與個資蒐集說明。</label>
    <button className="primary">{sent?'已送出 ✓':'送出諮詢'}</button>
    <a className="ig-link" href="https://www.instagram.com/xian._.185/" target="_blank"><Instagram size={16}/> Instagram @xian._.185</a>
  </form>
}

function FortuneSlots(){
  const [step,setStep]=useState(0)
  const [choices,setChoices]=useState([])
  const axes=[['戀愛','工作','金錢','人際','自我'],['主動','等待','觀察','突破','整理','放鬆'],['傳訊息','說清楚','去看看','做決定','找人聊','換個環境']]
  const result=useMemo(()=>step<3?null:routeResults[(todayKey()+choices.join('|')).split('').reduce((a,c)=>a+c.charCodeAt(0),0)%routeResults.length],[step,choices])
  function choose(v){const next=[...choices,v];setChoices(next);if(step===2){localStorage.setItem('yao_route_date',todayKey());localStorage.setItem('yao_route_result',JSON.stringify(next));trackEvent('fortune_slots_completed',{feature_key:'fortune_slots',choices:next})}setStep(step+1)}
  return <Layout><main className="feature-page"><span className="eyebrow">FORTUNE ROUTE</span><h1>命運三連線</h1><p className="lead">用三個選擇，整理出今天最適合你的行動方向。</p>{step<3?<div className="slot-wrap glass"><div className="step">STEP {step+1}/3</div><h2>{['今天最在意什麼？','你現在比較像哪種狀態？','今天願意做哪個行動？'][step]}</h2><div className="choice-grid">{axes[step].map(v=><button key={v} onClick={()=>choose(v)}>{v}</button>)}</div></div>:<div className="result-card glass"><span className="pill">{result.theme}</span><h2>{result.title}</h2><div className="result-grid"><div><small>今日訊號</small><p>{result.signal}</p></div><div><small>今日解讀</small><p>{result.read}</p></div><div><small>今日任務</small><p>{result.task}</p></div><div><small>今日避免</small><p>{result.avoid}</p></div></div><Link to="/report" className="primary link-btn">加入我的今日報告</Link></div>}</main></Layout>
}

function GenericFeature({type}){
  const map={love:['今日戀愛運','今天適合自然靠近，不必急著要答案。'],match:['兩人合拍度','你們的默契不差，真正的關鍵是表達節奏。'],charm:['魅力人格','你的魅力來自自然、不過度用力。'],draw:['曜境一籤','你抽到：先把能控制的事情做好。'],fortune:['今日綜合運勢','今天的主題是：把力氣放在最有回報的地方。'],money:['賺錢人格','你比較適合主動開源 + 穩定累積。'],wheel:['選擇困難轉盤','今天先做：完成一件你拖最久的小事。'],career:['職涯人格','你比較適合有成長空間、可主動發揮的工作。']}
  const [done,setDone]=useState(false)
  const [title,result]=map[type]
  return <Layout><main className="feature-page"><span className="eyebrow">YAO INTERACTIVE</span><h1>{title}</h1><p className="lead">先選一個最接近你現在狀態的答案。</p><div className="quiz-card glass">{!done?<div className="choice-grid">{['比較主動','先觀察','照自己的節奏'].map(v=><button key={v} onClick={()=>{setDone(true);trackEvent('feature_completed',{feature_key:type})}}>{v}</button>)}</div>:<div className="mini-result"><h2>{result}</h2><Link to="/report" className="primary link-btn">加入今日報告</Link></div>}</div></main></Layout>
}

function CareerMatch(){
  const [i,setI]=useState(0)
  const qs=[['你比較喜歡哪種工作節奏？',['跟人互動多','穩定有流程','自己安排節奏']],['你最在意哪一點？',['收入上限','工作氣氛','時間彈性']],['你最有自信的是？',['溝通應對','細節服務','主動開發']]]
  return <Layout><main className="feature-page"><span className="eyebrow">CAREER MATCH</span><h1>智能職缺配對</h1><p className="lead">3 題快速找出比較適合你的工作方向。</p><div className="quiz-card glass">{i<3?<><div className="step">STEP {i+1}/3</div><h2>{qs[i][0]}</h2><div className="choice-grid">{qs[i][1].map(v=><button key={v} onClick={()=>setI(i+1)}>{v}</button>)}</div></>:<div className="mini-result"><h2>推薦方向：酒店公關</h2><p>你的答案偏向高互動、收入成長、主動應對。</p><a href="/#jobs" className="primary link-btn">查看職缺</a></div>}</div></main></Layout>
}

function Salary(){
  const [hours,setHours]=useState(6),[days,setDays]=useState(4),[rate,setRate]=useState(1380)
  const weekly=hours*days*rate,monthly=Math.round(weekly*4.33)
  return <Layout><main className="feature-page"><span className="eyebrow">SALARY ESTIMATE</span><h1>薪資估算</h1><div className="salary-card glass"><label>時薪<input type="number" value={rate} onChange={e=>setRate(+e.target.value)}/></label><label>每天工時<input type="number" value={hours} onChange={e=>setHours(+e.target.value)}/></label><label>每週天數<input type="number" value={days} onChange={e=>setDays(+e.target.value)}/></label><div className="salary-result"><span>每週約</span><b>NT${weekly.toLocaleString()}</b><span>每月約</span><b>NT${monthly.toLocaleString()}</b></div></div></main></Layout>
}

function Report(){
  const route=localStorage.getItem('yao_route_date')===todayKey()
  const arr=route?JSON.parse(localStorage.getItem('yao_route_result')||'[]'):[]
  return <Layout><main className="feature-page"><span className="eyebrow">MY DAILY REPORT</span><h1>我的今日報告</h1><div className="report-full glass"><div className="report-score"><div className="progress-ring"><span>{route?'25':'0'}%</span></div><div><h2>{route?'今天已經開始探索':'今天還沒有探索紀錄'}</h2><p>{route?'完成更多互動，這份報告會慢慢長出來。':'先從命運三連線開始。'}</p></div></div>{route&&<div className="route-line"><b>今日路線</b><span>{arr.join(' → ')}</span></div>}</div></main></Layout>
}

function Privacy(){return <Layout><main className="text-page"><h1>隱私權與個資蒐集說明｜曜境 YAO</h1><p>互動測驗原則上可匿名使用。網站可能記錄匿名識別碼、頁面瀏覽、功能互動、有效停留時間、裝置類型、來源與 UTM。</p><p>諮詢表單可能蒐集姓名或暱稱、年齡、電話、LINE ID、Instagram ID、偏好聯絡方式、應徵職缺與留言。</p><p>娛樂互動資料不會自動與應徵表單中的個人識別資料綁定。</p></main></Layout>}

function Admin(){return <Layout><main className="feature-page"><span className="eyebrow">ADMIN</span><h1>Analytics Dashboard</h1><p className="lead">前端骨架已建立；接上 Supabase Auth + RLS 後再讀取正式數據。</p><div className="metric-grid">{['今日訪客','互動完成','平均功能數 / 人','平均停留','LINE / IG 點擊','表單送出'].map(x=><div className="metric glass" key={x}><small>{x}</small><b>—</b></div>)}</div></main></Layout>}

export default function App(){
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/fortune-slots" element={<FortuneSlots/>}/>
    {['love','match','charm','draw','fortune','money','wheel','career'].map(k=><Route key={k} path={'/'+k} element={<GenericFeature type={k}/>}/>)}
    <Route path="/career-match" element={<CareerMatch/>}/>
    <Route path="/salary" element={<Salary/>}/>
    <Route path="/report" element={<Report/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<Home/>}/>
  </Routes>
}
