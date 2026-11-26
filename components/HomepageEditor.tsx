'use client';

import MediaLibrary from './MediaLibrary';
import {useState,useCallback} from 'react';
import {Upload, RotateCcw} from 'lucide-react';
import {homepageDefaults} from '@/lib/homepage.mjs';
import {Homepage, request} from '@/lib/types';

const groups: {title:string; fields:[keyof Homepage,string][]}[] = [
  {title:'First impression',fields:[['heroHeading','Main heading'],['heroEyebrow','Location / short introduction'],['heroButton','Booking button text']]},
  {title:'The experience',fields:[['comparisonTitle','Image description'],['comparisonNote','Photo caption / illustration disclosure'],['experienceHeading','Section heading'],['experienceIntro','Introduction'],['experienceTitle','Feature heading'],['experienceBody','Feature description']]},
  {title:'Services introduction',fields:[['servicesHeading','Heading'],['servicesIntro','Description']]},
  {title:'Mobile detailing story',fields:[['storyHeading','Heading'],['storyBody','Description'],['storyImageAlt','Photo description for accessibility']]},
  {title:'FAQs, booking invitation and footer',fields:[['faqHeading','FAQ heading'],['ctaHeading','Booking invitation heading'],['ctaButton','Booking invitation button'],['footerText','Footer message']]}
];
const images: [keyof Homepage,string][] = [['beforeImage','Before photo'],['afterImage','After photo'],['storyImage','Mobile detailing photo']];

export default function HomepageEditor({value,onChange,onUploading,onError}:{value:Homepage;onChange:(key:keyof Homepage,value:string)=>void;onUploading:(busy:boolean)=>void;onError:(message:string)=>void}) {
  const [uploading,setUploading]=useState(''),[galleryKey,setGalleryKey]=useState<keyof Homepage|null>(null);
  const closeGallery=useCallback(()=>setGalleryKey(null),[]);
  async function upload(file:File|undefined,key:keyof Homepage) {
    if(!file)return;
    if(file.size>3000000||!['image/jpeg','image/png','image/webp'].includes(file.type)){onError('Choose a JPG, PNG or WebP up to 3 MB.');return;}
    setUploading(key);onUploading(true);onError('');
    try {const form=new FormData();form.set('file',file);const result=await request<{url:string}>('/api/admin/upload',{method:'POST',body:form});onChange(key,result.url);}
    catch(error){onError((error as Error).message);}
    finally{setUploading('');onUploading(false);}
  }
  return <div className="editor-list">{galleryKey&&<MediaLibrary onClose={closeGallery} onSelect={url=>{onChange(galleryKey,url);setGalleryKey(null)}}/>}
    <div className="admin-info"><p>Edit the text and photos below, then select <strong>Save changes</strong> to publish. Line breaks are preserved in headings. Services, FAQs and transformations have their own tabs.</p></div>
    <section className="admin-panel editor-card"><h2>Website photos</h2><p className="muted">The before and after photos appear in both homepage comparisons. Use matching angles and describe your photos honestly in the caption.</p><div className="website-image-grid">{images.map(([key,label])=><div className="website-image-card" key={key}><label className="photo-upload"><span>{label}</span><img src={value[key]} alt={label}/><input aria-label={'Upload '+label.toLowerCase()} type="file" accept="image/jpeg,image/png,image/webp" disabled={!!uploading} onChange={e=>{upload(e.target.files?.[0],key);e.target.value='';}}/>{uploading===key&&<b>Uploading…</b>}</label><p><Upload size={13}/> Select photo to replace · up to 3 MB</p><button className="admin-small-button" disabled={!!uploading} onClick={()=>setGalleryKey(key)}>Choose from gallery</button><button className="admin-small-button" disabled={!!uploading} onClick={()=>onChange(key,homepageDefaults[key])}><RotateCcw size={13}/>Use original photo</button></div>)}</div></section>
    {groups.map(group=><section className="admin-panel editor-card" key={group.title}><h2>{group.title}</h2>{group.fields.map(([key,label])=><label key={key}>{label}<textarea rows={key.endsWith('Body')?4:2} value={value[key]} maxLength={2000} onChange={e=>onChange(key,e.target.value)}/></label>)}</section>)}
  </div>;
}
