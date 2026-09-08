import React, { useState } from 'react'
import { Music2, Volume2, VolumeX } from 'lucide-react'

export default function Soundscape(){
  const [open,setOpen]=useState(false)
  const [enabled,setEnabled]=useState(localStorage.getItem('yao_audio_enabled')==='1')
  const modes=['🌌 星空','💗 心動','🌙 深夜','⚡ 行動']
  const [mode,setMode]=useState(localStorage.getItem('yao_audio_mode') || modes[0])

  function toggle(){
    const next=!enabled
    setEnabled(next)
    localStorage.setItem('yao_audio_enabled', next?'1':'0')
  }

  return <div className="soundscape">
    {open && <div className="sound-panel glass">
      <div className="sound-head"><div><strong>曜境聲場</strong><span>YAO Soundscape</span></div><button className="icon-btn" onClick={toggle}>{enabled?<Volume2 size={18}/>:<VolumeX size={18}/>}</button></div>
      <div className="mode-grid">
        {modes.map(m=><button key={m} className={mode===m?'active':''} onClick={()=>{setMode(m);localStorage.setItem('yao_audio_mode',m)}}>{m}</button>)}
      </div>
      <small className="muted">預設靜音。正式版可接合法授權或原創音樂檔。</small>
    </div>}
    <button className="floating-audio" onClick={()=>setOpen(v=>!v)} aria-label="曜境聲場"><Music2 size={19}/></button>
  </div>
}
