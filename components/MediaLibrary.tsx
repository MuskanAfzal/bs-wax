'use client';
import {useEffect,useState,useRef} from 'react';
import {X} from 'lucide-react';
import {request} from '@/lib/types';
type Photo={url:string;name:string};
export default function MediaLibrary({onSelect,onClose}:{onSelect:(url:string)=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [photos,setPhotos]=useState<Photo[]>([]),[next,setNext]=useState<number|null>(0),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function load(offset:number){setBusy(true);setError('');try{const result=await request<{images:Photo[];nextOffset:number|null}>('/api/admin/media?offset='+offset);setPhotos(previous=>offset===0?result.images:[...previous,...result.images]);setNext(result.nextOffset);}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 useEffect(()=>{dialog.current?.showModal();load(0);const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape)},[onClose]);
 return <dialog ref={dialog} className="media-dialog" aria-labelledby="media-title" onCancel={onClose}><header><div><h2 id="media-title">Your image gallery</h2><p>Original photos and previous uploads stay here when you replace an image.</p></div><button className="admin-icon" aria-label="Close image gallery" autoFocus onClick={onClose}><X size={18}/></button></header>{error&&<div role="alert" className="admin-alert error">{error}<button onClick={()=>load(next??0)}>Try again</button></div>}<div className="media-grid">{photos.map(photo=><button key={photo.url} onClick={()=>onSelect(photo.url)} title={photo.name}><img src={photo.url} alt={photo.name} loading="lazy"/><span>{photo.name.startsWith('Original')?photo.name:'Uploaded photo'}</span><small>Use this image</small></button>)}</div>{busy&&<p role="status">Loading photos…</p>}{next!==null&&!busy&&<button className="admin-small-button" onClick={()=>load(next)}>Load more photos</button>}</dialog>
}
